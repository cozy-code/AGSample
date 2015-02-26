using AGSample.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AGSample.DAL
{
    public class AGSampleInitializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<AGSampleContext>
    {
        protected override void Seed(AGSampleContext context) {
            var todos = new List<Todo> {
                new Todo{Text="AngularJSの学習",Done=false},
                new Todo{Text="AngularJSのアプリケーション構築",Done=false},
            };
            todos.ForEach(t => context.Todos.Add(t));
            context.SaveChanges();
        }
    }
}