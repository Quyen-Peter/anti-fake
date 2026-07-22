import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createAdminVoucher, fetchAdminVouchers, type Voucher } from '../../../services/admin.api';

export default function AdminVouchersPage() {
  const [items, setItems] = useState<Voucher[]>([]);
  const [form, setForm] = useState({ code: '', name: '', discountType: 'PERCENTAGE', percentage: '10', minOrderAmount: '0', startsAt: '', endsAt: '' });
  const load = async () => { try { setItems(await fetchAdminVouchers()); } catch (error) { toast.error(error instanceof Error ? error.message : 'Khong the tai voucher'); } };
  useEffect(() => { void load(); }, []);
  const create = async () => {
    try {
      await createAdminVoucher({ ...form, percentage: Number(form.percentage), minOrderAmount: Number(form.minOrderAmount), startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() });
      toast.success('Tao voucher thanh cong');
      await load();
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Khong the tao voucher'); }
  };
  return <section className="admin-page"><div className="admin-page-heading"><div><h1>Quan ly voucher he thong</h1><p>Tao va theo doi voucher do platform tai tro.</p></div></div><div className="admin-placeholder-card"><h2>Tao voucher</h2><div className="admin-placeholder-list"><input aria-label="Ma voucher" placeholder="Ma voucher" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /><input aria-label="Ten voucher" placeholder="Ten voucher" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input aria-label="Phan tram" type="number" placeholder="% giam" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} /><input aria-label="Don toi thieu" type="number" placeholder="Don toi thieu" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} /><input aria-label="Bat dau" type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /><input aria-label="Ket thuc" type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} /><button type="button" onClick={create}>Tao voucher</button></div></div><div className="admin-placeholder-card"><h2>Danh sach voucher</h2>{items.length === 0 ? <p>Chua co voucher.</p> : items.map((voucher) => <div className="admin-placeholder-list" key={voucher.id}><strong>{voucher.code}</strong><span>{voucher.name}</span><span>{voucher.discountType} · {voucher.status}</span></div>)}</div></section>;
}
