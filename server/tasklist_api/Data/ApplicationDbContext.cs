using Microsoft.EntityFrameworkCore;
using System;
using tasklist_api.Common;
using tasklist_api.Models;

namespace tasklist_api.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Task>().Property("StatusId").HasDefaultValue(Constants.status_notstarted);
            builder.Entity<Task>().Property("DateCreated").HasDefaultValueSql("getutcdate()");
            builder.Entity<Task>().Property("LastModified").HasDefaultValueSql("getutcdate()");
            builder.Entity<Task>().HasIndex(p => new {  p.DateCreated }).HasName("IX_Task_DateCreated");
        }

        public DbSet<Task> Task { get; set; }
    }
}
