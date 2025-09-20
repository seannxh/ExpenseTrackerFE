import { deleteExpense } from "../services/expenseService";

interface ExpenseItemProps {
  id?: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  onDeleted?: () => void;
}

const ExpenseItem = ({
  id,
  title,
  amount,
  category,
  date,
  onDeleted,
}: ExpenseItemProps) => {
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      if (id !== undefined) {
        await deleteExpense(id);
        onDeleted?.();
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete expense. Please try again.');
    }
  };

  return (
    <div className="flex justify-between items-center bg-[#282c34] p-4 rounded-md shadow mb-2 border border-gray-700">
      <div>
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-sm text-gray-400">
          {new Date(date).toLocaleDateString()}
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-green-400">${amount.toFixed(2)}</p>
        <p className="text-sm text-gray-300">{category}</p>
        <button
          onClick={handleDelete}
          className="ml-2 px-2 py-1 hover:bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
