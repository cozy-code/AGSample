using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AGSample.DAL;
using AGSample.Models;

namespace AGSample.Controllers
{
    public class TodoesController : ApiController
    {
        private AGSampleContext db = new AGSampleContext();

        // GET: api/Todoes
        public IQueryable<Todo> GetTodos()
        {
            return db.Todos;
        }

        // GET: api/Todoes/5
        [ResponseType(typeof(Todo))]
        public async Task<IHttpActionResult> GetTodo(Guid id)
        {
            Todo todo = await db.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }

        // PUT: api/Todoes/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutTodo(Guid id, Todo todo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != todo.Id)
            {
                return BadRequest();
            }

            db.Entry(todo).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TodoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Todoes
        [ResponseType(typeof(Todo))]
        public async Task<IHttpActionResult> PostTodo(Todo todo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Todos.Add(todo);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = todo.Id }, todo);
        }

        // DELETE: api/Todoes/5
        [ResponseType(typeof(Todo))]
        public async Task<IHttpActionResult> DeleteTodo(Guid id)
        {
            Todo todo = await db.Todos.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            db.Todos.Remove(todo);
            await db.SaveChangesAsync();

            return Ok(todo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool TodoExists(Guid id)
        {
            return db.Todos.Count(e => e.Id == id) > 0;
        }
    }
}