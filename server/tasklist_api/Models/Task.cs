using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using tasklist_api.Common;

namespace tasklist_api.Models
{
    public class Task
    {
        [Key]
        [JsonPropertyName("id")]
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Please enter a name for this task")]
        [JsonPropertyName("name")]
        [MaxLength(100)]
        public string Name { get; set; }
       
        [Required(ErrorMessage = "Please enter a description of this task")]
        [JsonPropertyName("description")]
        [MaxLength(1000)]
        public string Description { get; set; }

        [JsonPropertyName("status_id")]
        [Range(Constants.status_notstarted, Constants.status_completed, ErrorMessage = "Please select a valid Status")]
        public int StatusId { get; set; } = Constants.status_notstarted;

        [JsonPropertyName("date_created")]
        [ReadOnly(true)]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        [ReadOnly(true)]
        public DateTime LastModified { get; set; } = DateTime.UtcNow;
    }
}
