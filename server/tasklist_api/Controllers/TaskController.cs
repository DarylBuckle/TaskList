using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using tasklist_api.Common;
using tasklist_api.Data;

namespace tasklist_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;
        private readonly ILogger<TaskController> _logger;

        public TaskController(ApplicationDbContext dbcontext, ILogger<TaskController> logger)
        {
            _dbcontext = dbcontext;
            _logger = logger;
        }

        #region GetList
        [HttpGet]
        public async Task<List<Models.Task>> Get()
        {
            using (CancellationTokenSource cancellationTokenSource = new CancellationTokenSource(Constants.cancellation_timeout))
            {
                var result = new List<Models.Task>();
                bool include_completed = CommonFunctions.StrToBool(HttpContext?.Request.Query["include_completed"]);

                _logger?.LogInformation("Task GetList include_completed={0}", include_completed.ToString());

                if (include_completed)
                {
                    //Retrieve all tasks
                    //We order by DateCreated desc to show the newest first. Index on dbo.Tasks DateCreated speeds this up
                    //Runs: SELECT [t].[Id], [t].[DateCreated], [t].[Description], [t].[LastModified], [t].[Name], [t].[StatusId] FROM [Task] AS [t] ORDER BY [t].[DateCreated]
                    result = await _dbcontext.Task.OrderBy(a => a.DateCreated).ToListAsync(cancellationTokenSource.Token);
                }
                else
                {
                    //Retrieve all tasks that do not have status = completed
                    //We order by DateCreated desc to show the newest first. Index on dbo.Tasks DateCreated speeds this up
                    //Runs: SELECT [t].[Id], [t].[DateCreated], [t].[Description], [t].[LastModified], [t].[Name], [t].[StatusId] FROM [Task] AS [t] WHERE [t].[StatusId] <> 2 ORDER BY [t].[DateCreated]
                    result = await _dbcontext.Task.Where(o => o.StatusId != Constants.status_completed).OrderBy(a => a.DateCreated).ToListAsync(cancellationTokenSource.Token);
                }

                return result;
            }
        }
        #endregion


        #region GetOne
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            using (CancellationTokenSource cancellationTokenSource = new CancellationTokenSource(Constants.cancellation_timeout))
            {
                _logger?.LogInformation("Task GetOne id={0}", id);

                //Runs: SELECT [t].[Id], [t].[DateCreated], [t].[Description], [t].[LastModified], [t].[Name], [t].[StatusId] FROM [Task] AS [t] WHERE [t].[Id] = @id
                var task = await _dbcontext.Task.FirstOrDefaultAsync(o => o.Id == id, cancellationTokenSource.Token);
                if (task == null)
                {
                    return NotFound();
                }
                return Ok(task);
            }
        }
        #endregion


        #region Post
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Models.Task obj)
        {
            if ((!ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            var isnew = false;
            if (obj.Id > 0)
            {
                /*Id has been specified - we are updating an existing Task*/

                //validate the task already exists in the database
                var oldobjresult = await Get(obj.Id);
                if (oldobjresult.GetType() != typeof(OkObjectResult))
                {
                    return BadRequest(string.Format("Task ID: {0} not found.", obj.Id));
                }

                var oldobj = (Models.Task)((OkObjectResult)oldobjresult).Value;
                //old obj must have been found to give an OkObjectResult

                //update old object properties from our post - this doesn't update readonly fields
                CommonFunctions.CopyOldObjectAttributes(typeof(Models.Task), obj, oldobj, false);

                //set last modified to now
                oldobj.LastModified = DateTime.UtcNow;

                //Tell ef that oldobj needs updating
                _dbcontext.Task.Update(oldobj);

                //Copy old object props back to the posted object so we can send back the updated value in the response
                CommonFunctions.CopyOldObjectAttributes(typeof(Models.Task), oldobj, obj, true);
            }
            else
            {
                /*Id not specified - we are creating a new task*/
                isnew = true;

                //set default values
                obj.DateCreated = DateTime.UtcNow;
                obj.LastModified = DateTime.UtcNow;

                _dbcontext.Task.Add(obj);
            }

            //save to database
            try
            {
                using (CancellationTokenSource cancellationTokenSource = new CancellationTokenSource(Constants.cancellation_timeout))
                {
                    await _dbcontext.SaveChangesAsync(cancellationTokenSource.Token);
                }
            }
            catch (SqlException e)
            {
                _logger?.LogError("[[Handled Exception]] " + e.ToString());
                return BadRequest(string.Format("Save to database failed. Sql exception message: {0}", e.Message));
            }
            catch (Exception e)
            {
                _logger?.LogError("[[Handled Exception]] " + e.ToString());
                return BadRequest(string.Format("Save to database failed. Exception message: {0}" + e.Message));
            }

            if (isnew)
            {
                _logger?.LogInformation("New Task id={0}", obj.Id);
            }
            else
            {
                _logger?.LogInformation("Updated Task id={0}", obj.Id);
            }

            return CreatedAtAction("Get", new { id = obj.Id }, obj);
        }
        #endregion


        #region Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var getresult = await Get(id);
            if (getresult.GetType() != typeof(OkObjectResult))
            {
                return getresult;
            }

            var obj = (Models.Task)((OkObjectResult)getresult).Value;
            _dbcontext.Task.Remove(obj);

            //save to database
            try
            {
                using (CancellationTokenSource cancellationTokenSource = new CancellationTokenSource(Constants.cancellation_timeout))
                {
                    await _dbcontext.SaveChangesAsync(cancellationTokenSource.Token);
                }
            }
            catch (SqlException e)
            {
                _logger?.LogError("[[Handled Exception]] " + e.ToString());
                return BadRequest(string.Format("Delete failed. Sql exception message: {0}", e.Message));
            }
            catch (Exception e)
            {
                _logger?.LogError("[[Handled Exception]] " + e.ToString());
                return BadRequest(string.Format("Delete failed. Exception message: {0}" + e.Message));
            }

            _logger?.LogInformation("Deleted Task id={0}", obj.Id);

            return Ok(obj);
        }
        #endregion
    }
}
