interface ExpenseItemProps {
    description: string;
    amount: number;
    category: string;
    date: string;
  }
  
  const ExpenseItem = ({ description, amount, category, date }: ExpenseItemProps) => {
    return (
      <div className="flex justify-between items-center bg-[#282c34] p-4 rounded-md shadow mb-2 border border-gray-700">
        <div>
          <h4 className="text-lg font-semibold text-white">{description}</h4>
          <p className="text-sm text-gray-400">{new Date(date).toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-400">${amount.toFixed(2)}</p>
          <p className="text-sm text-gray-300">{category}</p>
        </div>
      </div>
    );
  };
  
  export default ExpenseItem;
  