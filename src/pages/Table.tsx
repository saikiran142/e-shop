import { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface TableData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  role: string;
  department: string;
  joinDate: string;
  lastActive: string;
  [key: string]: any;
}

const Table = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [columns, setColumns] = useState<Column[]>([
    { id: 'name', label: 'Name', visible: true },
    { id: 'email', label: 'Email', visible: true },
    { id: 'phone', label: 'Phone', visible: true },
    { id: 'address', label: 'Address', visible: true },
    { id: 'status', label: 'Status', visible: true },
    { id: 'role', label: 'Role', visible: true },
    { id: 'department', label: 'Department', visible: true },
    { id: 'joinDate', label: 'Join Date', visible: true },
    { id: 'lastActive', label: 'Last Active', visible: true },
    { id: 'actions', label: 'Actions', visible: true },
  ]);

  // Sample data - replace with your actual data
  const [tableData] = useState<TableData[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      address: '123 Main St, New York, NY',
      status: 'Active',
      role: 'Developer',
      department: 'Engineering',
      joinDate: '2023-01-01',
      lastActive: '2024-03-15',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '234-567-8901',
      address: '456 Oak Ave, Los Angeles, CA',
      status: 'Active',
      role: 'Designer',
      department: 'Design',
      joinDate: '2023-02-15',
      lastActive: '2024-03-14',
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '345-678-9012',
      address: '789 Pine Rd, Chicago, IL',
      status: 'Inactive',
      role: 'Manager',
      department: 'Marketing',
      joinDate: '2023-03-10',
      lastActive: '2024-02-28',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '456-789-0123',
      address: '321 Elm St, Houston, TX',
      status: 'Active',
      role: 'Analyst',
      department: 'Data',
      joinDate: '2023-04-05',
      lastActive: '2024-03-15',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@example.com',
      phone: '567-890-1234',
      address: '654 Maple Dr, Miami, FL',
      status: 'Active',
      role: 'Developer',
      department: 'Engineering',
      joinDate: '2023-05-20',
      lastActive: '2024-03-13',
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '678-901-2345',
      address: '987 Cedar Ln, Seattle, WA',
      status: 'Inactive',
      role: 'Designer',
      department: 'Design',
      joinDate: '2023-06-15',
      lastActive: '2024-02-15',
    },
    {
      id: 7,
      name: 'Robert Wilson',
      email: 'robert@example.com',
      phone: '789-012-3456',
      address: '147 Birch Ave, Boston, MA',
      status: 'Active',
      role: 'Manager',
      department: 'Sales',
      joinDate: '2023-07-01',
      lastActive: '2024-03-15',
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      phone: '890-123-4567',
      address: '258 Spruce St, Denver, CO',
      status: 'Active',
      role: 'Analyst',
      department: 'Data',
      joinDate: '2023-08-10',
      lastActive: '2024-03-14',
    },
    {
      id: 9,
      name: 'James Taylor',
      email: 'james@example.com',
      phone: '901-234-5678',
      address: '369 Willow Rd, Portland, OR',
      status: 'Inactive',
      role: 'Developer',
      department: 'Engineering',
      joinDate: '2023-09-05',
      lastActive: '2024-01-30',
    },
    {
      id: 10,
      name: 'Michelle Martinez',
      email: 'michelle@example.com',
      phone: '012-345-6789',
      address: '741 Aspen Dr, San Diego, CA',
      status: 'Active',
      role: 'Designer',
      department: 'Design',
      joinDate: '2023-10-20',
      lastActive: '2024-03-15',
    },
    {
      id: 11,
      name: 'Thomas Garcia',
      email: 'thomas@example.com',
      phone: '123-456-7891',
      address: '852 Oak St, Phoenix, AZ',
      status: 'Active',
      role: 'Manager',
      department: 'Marketing',
      joinDate: '2023-11-15',
      lastActive: '2024-03-13',
    },
    {
      id: 12,
      name: 'Jennifer Lee',
      email: 'jennifer@example.com',
      phone: '234-567-8902',
      address: '963 Pine Ave, Philadelphia, PA',
      status: 'Inactive',
      role: 'Analyst',
      department: 'Data',
      joinDate: '2023-12-01',
      lastActive: '2024-02-28',
    },
    {
      id: 13,
      name: 'Christopher White',
      email: 'chris@example.com',
      phone: '345-678-9013',
      address: '159 Maple Ln, San Francisco, CA',
      status: 'Active',
      role: 'Developer',
      department: 'Engineering',
      joinDate: '2024-01-10',
      lastActive: '2024-03-15',
    },
    {
      id: 14,
      name: 'Amanda Harris',
      email: 'amanda@example.com',
      phone: '456-789-0124',
      address: '357 Cedar Dr, Austin, TX',
      status: 'Active',
      role: 'Designer',
      department: 'Design',
      joinDate: '2024-02-05',
      lastActive: '2024-03-14',
    },
    {
      id: 15,
      name: 'Daniel Clark',
      email: 'daniel@example.com',
      phone: '567-890-1235',
      address: '486 Birch Rd, Nashville, TN',
      status: 'Inactive',
      role: 'Manager',
      department: 'Sales',
      joinDate: '2024-03-01',
      lastActive: '2024-03-10',
    }
  ]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  // Page change handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const toggleColumn = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleAction = (action: string, id: number) => {
    console.log(`Action ${action} performed on row ${id}`);
    // Implement your action handlers here
  };

  const CustomInput = ({ value, onClick }: { value?: string; onClick?: () => void }) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        className="w-full pl-10 pr-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
        placeholder="Select date and time"
      />
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
    </div>
  );

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Data Table</h1>
        
        {/* Date Range Selector */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Date Range Selection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Start Date & Time
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full"
                calendarClassName="react-datepicker-custom"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                showMonthDropdown
                scrollableMonthYearDropdown
                customInput={<CustomInput />}
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                inline={false}
                calendarStartDay={1}
                timeClassName={() => "react-datepicker__time-container"}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                End Date & Time
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || undefined}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full"
                calendarClassName="react-datepicker-custom"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                showMonthDropdown
                scrollableMonthYearDropdown
                customInput={<CustomInput />}
                popperClassName="react-datepicker-popper"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                inline={false}
                calendarStartDay={1}
                timeClassName={() => "react-datepicker__time-container"}
              />
            </div>
          </div>
        </div>

        {/* Column Visibility Toggle */}
        <div className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Column Visibility</h2>
          <div className="flex flex-wrap gap-2">
            {columns.map(column => (
              <button
                key={column.id}
                onClick={() => toggleColumn(column.id)}
                className={`px-3 py-1 text-sm rounded-full ${
                  column.visible
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {column.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {columns.filter(col => col.visible).map(column => (
                  <th key={column.id} className="px-6 py-3">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row) => (
                <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  {columns.filter(col => col.visible).map(column => (
                    <td key={column.id} className="px-6 py-4">
                      {column.id === 'actions' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction('edit', row.id)}
                            className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction('delete', row.id)}
                            className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        row[column.id]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 text-sm border border-gray-300 rounded dark:bg-dark-primary dark:border-dark-primary dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, tableData.length)} of {tableData.length} entries
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 bg-white border border-gray-300 rounded dark:bg-dark-primary dark:border-dark-primary dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  index + 1 === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-dark-primary dark:text-gray-300'
                } ${
                  index + 1 === currentPage
                    ? 'cursor-default'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 bg-white border border-gray-300 rounded dark:bg-dark-primary dark:border-dark-primary dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table; 