using AGSample.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace AGSample.DAL
{
    public class AGSampleContext : DbContext
    {
        public AGSampleContext() : base("AGSampleDb"){} //connection string name
        public DbSet<Todo> Todos { get; set; }
    }
}