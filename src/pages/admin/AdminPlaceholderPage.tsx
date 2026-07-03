type AdminPlaceholderPageProps = {
  title: string;
  description: string;
  actions: string[];
};

export default function AdminPlaceholderPage({
  title,
  description,
  actions,
}: AdminPlaceholderPageProps) {
  return (
    <section className="admin-page">
      <div className="admin-page-heading">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="admin-placeholder-card">
        <h2>Chức năng quản lý</h2>
        <p>Trang đã sẵn khung layout để nối API và bảng dữ liệu.</p>
        <div className="admin-placeholder-list">
          {actions.map((action) => (
            <span key={action}>{action}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
