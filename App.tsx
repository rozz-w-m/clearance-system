import { useState } from 'react';
import jsPDF from 'jspdf';
import './index.css';

interface Book {
  name: string;
  number: string;
}

interface LabDamage {
  item: string;
  price: string;
}

interface FormData {
  studentName: string;
  admissionNumber: string;
  className: string;
  feeBalance: string;
  reamsNotBrought: string;
  booksNotReturned: Book[];
  labDamages: LabDamage[];
  date: string;
}

export default function ClearanceForm() {
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    admissionNumber: '',
    className: '',
    feeBalance: '',
    reamsNotBrought: '',
    booksNotReturned: [{ name: '', number: '' }],
    labDamages: [{ item: '', price: '' }],
    date: new Date().toISOString().split('T')[0],
  });

  const handleBookChange = (idx: number, field: keyof Book, value: string) => {
    const updated = [...formData.booksNotReturned];
    updated[idx][field] = value;
    setFormData({ ...formData, booksNotReturned: updated });
  };

  const addBook = () => setFormData({ ...formData, booksNotReturned: [...formData.booksNotReturned, { name: '', number: '' }] });

  const removeBook = (idx: number) => setFormData({
    ...formData,
    booksNotReturned: formData.booksNotReturned.filter((_, i) => i !== idx)
  });

  const handleLabChange = (idx: number, field: keyof LabDamage, value: string) => {
    const updated = [...formData.labDamages];
    updated[idx][field] = value;
    setFormData({ ...formData, labDamages: updated });
  };

  const addLab = () => setFormData({ ...formData, labDamages: [...formData.labDamages, { item: '', price: '' }] });

  const removeLab = (idx: number) => setFormData({
    ...formData,
    labDamages: formData.labDamages.filter((_, i) => i !== idx)
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("ST CLARE'S GIRLS SECONDARY SCHOOL", 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('LANET, NAKURU', 105, 25, { align: 'center' });
    doc.text('PO BOX 17481, Nakuru | TEL: 0721274519', 105, 32, { align: 'center' });
    doc.setFontSize(16);
    doc.text('STUDENT CLEARANCE FORM', 105, 50, { align: 'center' });
    doc.setFontSize(12);
    doc.text('(For Transfer Purposes)', 105, 58, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let y = 80;
    doc.text(`Date: ${formData.date}`, 20, y);
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('STUDENT INFORMATION:', 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Student Name: ${formData.studentName}`, 20, y);
    y += 8;
    doc.text(`Admission Number: ${formData.admissionNumber}`, 20, y);
    y += 8;
    doc.text(`Class: ${formData.className}`, 20, y);
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('CLEARANCE ITEMS:', 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Fee Balance: KES ${formData.feeBalance || '0'}`, 20, y);
    y += 8;
    doc.text(`Reams Not Brought: ${formData.reamsNotBrought || '0'}`, 20, y);
    y += 8;
    doc.text('Laboratory Damages:', 20, y);
    y += 8;
    formData.labDamages.forEach((lab) => {
      if (lab.item || lab.price) {
        doc.text(`  - ${lab.item} (${lab.price ? 'KES ' + lab.price : ''})`, 25, y);
        y += 7;
      }
    });
    doc.text('Books Not Returned:', 20, y);
    y += 8;
    formData.booksNotReturned.forEach((book) => {
      if (book.name || book.number) {
        doc.text(`  - ${book.name} (No: ${book.number})`, 25, y);
        y += 7;
      }
    });
    y += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️ NOTE:', 105, y + 3, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('All outstanding balances MUST be cleared before transfer is approved.', 105, 250, { align: 'center' });
    doc.save(`clearance-form-${formData.admissionNumber}.pdf`);
  };

  return (
    <div className="container">
      <div className="form-wrapper">
        <div className="header">
          <h1>ST CLARE'S GIRLS SECONDARY SCHOOL</h1>
          <p className="subtitle">LANET, NAKURU</p>
          <p className="contact">PO BOX 17481, Nakuru | TEL: 0721274519</p>
        </div>
        <div className="form-container">
          <div className="form-title">
            <h2>Student Clearance Form</h2>
            <p>(For Transfer Purposes)</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); generatePDF(); }} className="form">
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
            </div>

            <div className="section">
              <div className="section-header">
                <div className="section-indicator amber"></div>
                <h3 className="section-title">Student Information</h3>
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Student Name *</label>
                  <input type="text" value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Admission Number *</label>
                  <input type="text" value={formData.admissionNumber} onChange={e => setFormData({ ...formData, admissionNumber: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Class *</label>
                  <input type="text" value={formData.className} onChange={e => setFormData({ ...formData, className: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <div className="section-indicator red"></div>
                <h3 className="section-title">Clearance Items</h3>
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Fee Balance (KES)</label>
                  <input type="number" value={formData.feeBalance} onChange={e => setFormData({ ...formData, feeBalance: e.target.value })} min="0" />
                </div>
                <div className="form-group">
                  <label>Reams Not Brought</label>
                  <input type="number" value={formData.reamsNotBrought} onChange={e => setFormData({ ...formData, reamsNotBrought: e.target.value })} min="0" />
                </div>
              </div>

              <div className="form-group">
                <label>Laboratory Damages</label>
                {formData.labDamages.map((lab, idx) => (
                  <div key={idx} className="flex-group">
                    <input type="text" placeholder="Item damaged" value={lab.item} onChange={e => handleLabChange(idx, 'item', e.target.value)} />
                    <input type="number" placeholder="Price (KES)" value={lab.price} onChange={e => handleLabChange(idx, 'price', e.target.value)} min="0" />
                    {formData.labDamages.length > 1 && (
                      <button type="button" onClick={() => removeLab(idx)} className="remove-button">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addLab} className="add-button">+ Add Damage</button>
              </div>

              <div className="form-group">
                <label>Books Not Returned</label>
                {formData.booksNotReturned.map((book, idx) => (
                  <div key={idx} className="flex-group">
                    <input type="text" placeholder="Book name" value={book.name} onChange={e => handleBookChange(idx, 'name', e.target.value)} />
                    <input type="text" placeholder="Book number" value={book.number} onChange={e => handleBookChange(idx, 'number', e.target.value)} />
                    {formData.booksNotReturned.length > 1 && (
                      <button type="button" onClick={() => removeBook(idx)} className="remove-button">×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addBook} className="add-button">+ Add Book</button>
              </div>
            </div>

            <div className="warning">
              <svg className="warning-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="warning-content">
                <h3>⚠️ CLEAR THE PENDING BALANCES TO COMPLETE TRANSFER! ⚠️</h3>
                <p>All outstanding balances must be settled before the transfer can be approved.</p>
              </div>
            </div>

            <div className="button-container">
              <button type="submit" className="submit-button">
                <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Generate Clearance PDF</span>
              </button>
            </div>
          </form>
        </div>
        <div className="footer">
          <p>© 2024 ST Clare's Girls Secondary School Lanet. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
