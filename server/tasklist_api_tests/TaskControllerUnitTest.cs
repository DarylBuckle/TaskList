using System;
using System.Threading.Tasks;
using Xunit;
using tasklist_api.Controllers;
using tasklist_api.Models;
using Microsoft.AspNetCore.Mvc;

namespace tasklist_api.UnitTests
{
    public class TaskControllerUnitTest
    {
        [Fact]
        public async System.Threading.Tasks.Task TestGetTaskList()
        {
            //test we can retrieve a list of tasks

            var dbContext = DbContextMocker.GetApplicationDbContext(nameof(TestGetTaskList));
            var controller = new TaskController(dbContext, null);

            var response = await controller.Get();
            dbContext.Dispose();

            Assert.True(response.Count > 0);
        }

        [Fact]
        public async System.Threading.Tasks.Task TestGetId1()
        {
            //test we can get one task

            var dbContext = DbContextMocker.GetApplicationDbContext(nameof(TestGetId1));
            var controller = new TaskController(dbContext, null);

            var response = (Models.Task)((OkObjectResult)await controller.Get(1)).Value; 

            dbContext.Dispose();

            Assert.True(response.Id == 1);
        }

        [Fact]
        public async System.Threading.Tasks.Task TestUpdate()
        {
            //test we can update a task, and that datecreated cannot be modified

            var dbContext = DbContextMocker.GetApplicationDbContext(nameof(TestUpdate));
            var controller = new TaskController(dbContext, null);

            var now = DateTime.Now;
            await controller.Post(new Models.Task() { Id = 1, DateCreated = now, StatusId = 1 });
            var response = (Models.Task)((OkObjectResult)await controller.Get(1)).Value;

            dbContext.Dispose();

            Assert.True(response.Id == 1 && response.StatusId == 1 && response.DateCreated != now);
        }


        [Fact]
        public async System.Threading.Tasks.Task TestCreate()
        {
            //test we can update a task, and that datecreated cannot be modified

            var dbContext = DbContextMocker.GetApplicationDbContext(nameof(TestCreate));
            var controller = new TaskController(dbContext, null);

            var now = DateTime.Now;
            var addresult = await controller.Post(new Models.Task() { Name = "A nice new task", Description = "Some tasky stuff", StatusId = 0 });
            var newid = ((Models.Task)((CreatedAtActionResult)addresult).Value).Id;
            var response = (Models.Task)((OkObjectResult)await controller.Get(newid)).Value;

            dbContext.Dispose();

            Assert.True(response.Id == newid && response.Name == "A nice new task");
        }

        [Fact]
        public async System.Threading.Tasks.Task TestDelete()
        {
            //test we can delete a task

            var dbContext = DbContextMocker.GetApplicationDbContext(nameof(TestDelete));
            var controller = new TaskController(dbContext, null);

            var now = DateTime.Now;
            var deleteresult = await controller.Delete(4);
            var response = await controller.Get(4);

            dbContext.Dispose();

            Assert.True(response is NotFoundResult);
        }
    }
}
