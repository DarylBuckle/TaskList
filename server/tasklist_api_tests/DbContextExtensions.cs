using System;
using tasklist_api.Models;
using tasklist_api.Data;

namespace tasklist_api.UnitTests
{
    public static class DbContextExtensions
    {
        public static void Seed(this ApplicationDbContext dbContext)
        {
            // Add entities for DbContext instance

            dbContext.Task.Add(new Models.Task
            {
                Id = 1,
                Name = "Test Task 1",
                Description = "test task description",
                StatusId = 0,
                DateCreated = DateTime.UtcNow.AddDays(-1),
                LastModified = DateTime.UtcNow.AddDays(-1)
            });

            dbContext.Task.Add(new Models.Task
            {
                Id = 2,
                Name = "Test Task 2",
                Description = "test task description",
                StatusId = 1,
                DateCreated = DateTime.UtcNow.AddDays(-0.5),
                LastModified = DateTime.UtcNow.AddDays(-0.5)
            });

            dbContext.Task.Add(new Models.Task
            {
                Id = 3,
                Name = "Test Task 3",
                Description = "test task description",
                StatusId = 0,
                DateCreated = DateTime.UtcNow.AddMinutes(-1),
                LastModified = DateTime.UtcNow.AddMinutes(-1)
            });

            dbContext.Task.Add(new Models.Task
            {
                Id = 4,
                Name = "Test Task 4",
                Description = "test task description",
                StatusId = 2,
                DateCreated = DateTime.UtcNow,
                LastModified = DateTime.UtcNow
            });


            dbContext.SaveChanges();
        }
    }
}