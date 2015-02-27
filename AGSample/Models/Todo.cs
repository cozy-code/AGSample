using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AGSample.Models
{
    public class Todo
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool Done { get; set; }
    }
}