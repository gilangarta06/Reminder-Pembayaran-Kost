export function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Nama wajib diisi";

  const phoneRegex = /^0\d{9,12}$/;
  if (!form.phone.trim()) errors.phone = "Nomor WA wajib diisi";
  else if (!phoneRegex.test(form.phone))
    errors.phone = "Format nomor salah (contoh: 08123456789)";

  if (!form.rent_amount.trim()) errors.rent_amount = "Harga sewa wajib diisi";
  else if (isNaN(form.rent_amount) || Number(form.rent_amount) <= 0)
    errors.rent_amount = "Harga sewa harus lebih dari 0";

  if (!form.due_date) errors.due_date = "Tanggal jatuh tempo wajib diisi";
  else {
    const dueDate = new Date(form.due_date);
    const today = new Date();
    if (dueDate < today)
      errors.due_date = "Tanggal jatuh tempo tidak boleh kurang dari hari ini";
  }

  return errors;
}
