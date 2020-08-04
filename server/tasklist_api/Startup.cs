using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using tasklist_api.Data;

namespace tasklist_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //CORS Policy
            services.AddCors(options =>
            {
#if DEBUG
                //Is Dev Env - Allow Dev Client URL
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    );
#else
                //Production - Allow only production client
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .WithOrigins("") //enter production url here
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    );
#endif
            });

            //Configure ApplicationDbContext to connect to sql server
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                //Connection string in appsettings.json (Production) or appsettings.development.json (Development)
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            //Configure logging
            LogLevel loglevel = LogLevel.Warning;

            //Get log level from appsettings
            var loglevelstr = Configuration.GetSection("Logging")?.GetSection("LogLevel")?.GetSection("Default")?.Value;
            switch (loglevelstr.ToLower())
            {
                case "none": loglevel = LogLevel.None; break;
                case "critical": loglevel = LogLevel.Critical; break;
                case "error": loglevel = LogLevel.Error; break;
                case "warning": loglevel = LogLevel.Warning; break;
                case "debug": loglevel = LogLevel.Debug; break;
                case "information": loglevel = LogLevel.Information; break;
                case "trace": loglevel = LogLevel.Trace; break;
            }

            //Log to file - Logs/API-Log-CurrentDate.text
            loggerFactory.AddFile("Logs/API-Log-{Date}.txt", loglevel);


            app.UseCors("CorsPolicy");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

#if !DEBUG
            //if not Development, force upgrade to https
            app.UseHttpsRedirection();
#endif

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
