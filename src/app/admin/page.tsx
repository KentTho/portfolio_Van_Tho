export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-fg">Admin dashboard</h1>
      <p className="mt-3 max-w-xl text-fg-muted">
        Placeholder shell. Authentication, content operations and CRUD are added in
        later Waves. No admin functionality is active yet.
      </p>
      <div className="mt-8 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
        Not protected yet — route authorization is implemented in Wave 03.
      </div>
    </div>
  );
}
