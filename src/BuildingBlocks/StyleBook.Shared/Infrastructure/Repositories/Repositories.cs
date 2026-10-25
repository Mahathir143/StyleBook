using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using StyleBook.Shared.Infrastructure.Data;

namespace StyleBook.Shared.Infrastructure.Repositories;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(object id, CancellationToken ct = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default);
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task AddAsync(T entity, CancellationToken ct = default);
    void Update(T entity);
    void Delete(T entity);
    IQueryable<T> Query();
}

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly StyleBookDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(StyleBookDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(object id, CancellationToken ct = default)
    {
        return await _dbSet.FindAsync(new[] { id }, ct);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default)
    {
        return await _dbSet.ToListAsync(ct);
    }

    public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
    {
        return await _dbSet.Where(predicate).ToListAsync(ct);
    }

    public virtual async Task AddAsync(T entity, CancellationToken ct = default)
    {
        await _dbSet.AddAsync(entity, ct);
    }

    public virtual void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public virtual void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public virtual IQueryable<T> Query()
    {
        return _dbSet.AsQueryable();
    }
}

public interface IUnitOfWork : IDisposable
{
    IRepository<T> Repository<T>() where T : class;
    Task<int> CommitAsync(CancellationToken ct = default);
    Task RollbackAsync();
}

public class UnitOfWork : IUnitOfWork
{
    private readonly StyleBookDbContext _context;
    private readonly Dictionary<Type, object> _repositories = new();

    public UnitOfWork(StyleBookDbContext context)
    {
        _context = context;
    }

    public IRepository<T> Repository<T>() where T : class
    {
        var type = typeof(T);
        if (!_repositories.ContainsKey(type))
        {
            var repositoryInstance = new Repository<T>(_context);
            _repositories.Add(type, repositoryInstance);
        }
        return (IRepository<T>)_repositories[type];
    }

    public async Task<int> CommitAsync(CancellationToken ct = default)
    {
        return await _context.SaveChangesAsync(ct);
    }

    public Task RollbackAsync()
    {
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
