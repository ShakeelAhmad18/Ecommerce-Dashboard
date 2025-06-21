import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiPlus,
  FiFilter,
  FiX,
  FiMail,
  FiPhone,
  FiStar,
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiCreditCard,
  FiBriefcase,
  FiHome,
  FiClock,
  FiDollarSign,
  FiKey,
  FiShield,
} from "react-icons/fi";
import { FaChartLine, FaRegChartBar, FaRegUserCircle } from "react-icons/fa";
import { BsThreeDotsVertical, BsCheckCircleFill } from "react-icons/bs";
import { RiTeamLine } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { MultiSelect } from "react-multi-select-component";
import { Avatar, AvatarGroup } from "@mui/material";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showStaffDetails, setShowStaffDetails] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    department: "",
    role: "",
    joinDate: null,
    skills: [],
    isActive: true,
  });
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [availableSkills, setAvailableSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "UI/UX",
    "Project Management",
    "Sales",
    "Marketing",
    "Customer Service",
    "Accounting",
    "HR",
  ]);
  const staffPerPage = 10;

  // Mock staff data with enhanced fields
  const staffMembers = [
    {
      id: "EMP1001",
      employeeId: "EMP1001",
      name: "Leslie Alexander",
      email: "leslie.alexander@company.com",
      phone: "+1 (555) 123-4567",
      position: "Senior Software Engineer",
      department: "Engineering",
      role: "Developer",
      salary: 95000,
      joinDate: "2021-03-12",
      address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
      status: "active",
      employmentType: "full-time",
      skills: ["JavaScript", "React", "Node.js"],
      notes: "Top performer. Leads the frontend team.",
      emergencyContact: {
        name: "John Alexander",
        relation: "Spouse",
        phone: "+1 (555) 987-6543",
      },
      leaveBalance: 15,
      lastPromotionDate: "2023-01-15",
      manager: "Sarah Johnson",
      projects: ["Website Redesign", "Mobile App"],
      isAdmin: false,
      attendance: {
        present: 95,
        absent: 5,
        late: 2,
      },
      performanceRating: 4.8,
    },
    {
      id: "EMP1002",
      employeeId: "EMP1002",
      name: "Eleanor Pena",
      email: "eleanor.pena@company.com",
      phone: "+1 (555) 234-5678",
      position: "HR Manager",
      department: "Human Resources",
      role: "Manager",
      salary: 85000,
      joinDate: "2020-05-22",
      address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
      status: "active",
      employmentType: "full-time",
      skills: ["HR Management", "Recruitment", "Employee Relations"],
      notes: "Handles all HR operations and recruitment.",
      emergencyContact: {
        name: "Michael Pena",
        relation: "Spouse",
        phone: "+1 (555) 876-5432",
      },
      leaveBalance: 12,
      lastPromotionDate: "2022-06-10",
      manager: "CEO",
      projects: ["Employee Engagement", "Policy Update"],
      isAdmin: true,
      attendance: {
        present: 98,
        absent: 2,
        late: 0,
      },
      performanceRating: 4.9,
    },
    {
      id: "EMP1003",
      employeeId: "EMP1003",
      name: "Robert Fox",
      email: "robert.fox@company.com",
      phone: "+1 (555) 345-6789",
      position: "Marketing Specialist",
      department: "Marketing",
      role: "Specialist",
      salary: 75000,
      joinDate: "2022-01-05",
      address: "3517 W. Gray St. Utica, Pennsylvania 57867",
      status: "on-leave",
      employmentType: "full-time",
      skills: ["Digital Marketing", "SEO", "Content Creation"],
      notes: "Currently on maternity leave until August 2023.",
      emergencyContact: {
        name: "Jennifer Fox",
        relation: "Spouse",
        phone: "+1 (555) 765-4321",
      },
      leaveBalance: 0,
      lastPromotionDate: null,
      manager: "Lisa Brown",
      projects: ["Brand Campaign", "Social Media"],
      isAdmin: false,
      attendance: {
        present: 85,
        absent: 15,
        late: 3,
      },
      performanceRating: 4.2,
    },
    {
      id: "EMP1004",
      employeeId: "EMP1004",
      name: "Devon Lane",
      email: "devon.lane@company.com",
      phone: "+1 (555) 456-7890",
      position: "Junior Accountant",
      department: "Finance",
      role: "Accountant",
      salary: 65000,
      joinDate: "2023-02-18",
      address: "3891 Ranchview Dr. Richardson, California 62639",
      status: "probation",
      employmentType: "full-time",
      skills: ["Bookkeeping", "Tax Preparation", "QuickBooks"],
      notes: "New hire, currently in 3-month probation period.",
      emergencyContact: {
        name: "Patricia Lane",
        relation: "Mother",
        phone: "+1 (555) 654-3210",
      },
      leaveBalance: 5,
      lastPromotionDate: null,
      manager: "Mark Wilson",
      projects: ["Annual Audit", "Budget Planning"],
      isAdmin: false,
      attendance: {
        present: 100,
        absent: 0,
        late: 0,
      },
      performanceRating: 3.9,
    },
    {
      id: "EMP1005",
      employeeId: "EMP1005",
      name: "Jane Cooper",
      email: "jane.cooper@company.com",
      phone: "+1 (555) 567-8901",
      position: "Sales Executive",
      department: "Sales",
      role: "Sales",
      salary: 70000,
      joinDate: "2021-11-30",
      address: "2715 Ash Dr. San Jose, South Dakota 83475",
      status: "active",
      employmentType: "full-time",
      skills: ["Sales", "Negotiation", "CRM"],
      notes: "Consistently exceeds sales targets.",
      emergencyContact: {
        name: "Richard Cooper",
        relation: "Husband",
        phone: "+1 (555) 543-2109",
      },
      leaveBalance: 8,
      lastPromotionDate: "2022-12-01",
      manager: "Tom Harris",
      projects: ["Q4 Sales Push", "New Market Expansion"],
      isAdmin: false,
      attendance: {
        present: 92,
        absent: 8,
        late: 5,
      },
      performanceRating: 4.7,
    },
    {
      id: "EMP1006",
      employeeId: "EMP1006",
      name: "Wade Warren",
      email: "wade.warren@company.com",
      phone: "+1 (555) 678-9012",
      position: "IT Support Specialist",
      department: "IT",
      role: "Support",
      salary: 60000,
      joinDate: "2020-07-15",
      address: "4517 Washington Ave. Manchester, Kentucky 39495",
      status: "active",
      employmentType: "part-time",
      skills: ["IT Support", "Networking", "Hardware"],
      notes: "Works 3 days a week. Handles all IT support tickets.",
      emergencyContact: {
        name: "Samantha Warren",
        relation: "Partner",
        phone: "+1 (555) 432-1098",
      },
      leaveBalance: 6,
      lastPromotionDate: "2021-09-10",
      manager: "Alex Turner",
      projects: ["System Upgrade", "Security Audit"],
      isAdmin: false,
      attendance: {
        present: 100,
        absent: 0,
        late: 1,
      },
      performanceRating: 4.5,
    },
    {
      id: "EMP1007",
      employeeId: "EMP1007",
      name: "Kristin Watson",
      email: "kristin.watson@company.com",
      phone: "+1 (555) 789-0123",
      position: "UX Designer",
      department: "Design",
      role: "Designer",
      salary: 80000,
      joinDate: "2022-04-05",
      address: "4140 Parker Rd. Allentown, New Mexico 31134",
      status: "active",
      employmentType: "full-time",
      skills: ["UI/UX", "Figma", "Prototyping"],
      notes: "Leads the design team. Excellent collaboration skills.",
      emergencyContact: {
        name: "Daniel Watson",
        relation: "Husband",
        phone: "+1 (555) 321-0987",
      },
      leaveBalance: 10,
      lastPromotionDate: null,
      manager: "Sarah Johnson",
      projects: ["Website Redesign", "Mobile App"],
      isAdmin: false,
      attendance: {
        present: 97,
        absent: 3,
        late: 0,
      },
      performanceRating: 4.6,
    },
    {
      id: "EMP1008",
      employeeId: "EMP1008",
      name: "Cameron Williamson",
      email: "cameron.williamson@company.com",
      phone: "+1 (555) 890-1234",
      position: "Operations Manager",
      department: "Operations",
      role: "Manager",
      salary: 90000,
      joinDate: "2019-08-20",
      address: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      status: "active",
      employmentType: "full-time",
      skills: ["Operations", "Process Improvement", "Logistics"],
      notes: "Oversees all operational activities.",
      emergencyContact: {
        name: "Taylor Williamson",
        relation: "Spouse",
        phone: "+1 (555) 210-9876",
      },
      leaveBalance: 18,
      lastPromotionDate: "2021-11-15",
      manager: "CEO",
      projects: ["Warehouse Optimization", "Vendor Management"],
      isAdmin: true,
      attendance: {
        present: 99,
        absent: 1,
        late: 0,
      },
      performanceRating: 4.9,
    },
    {
      id: "EMP1009",
      employeeId: "EMP1009",
      name: "Brooklyn Simmons",
      email: "brooklyn.simmons@company.com",
      phone: "+1 (555) 901-2345",
      position: "Customer Support",
      department: "Support",
      role: "Support",
      salary: 55000,
      joinDate: "2023-01-10",
      address: "6391 Elgin St. Celina, Delaware 10299",
      status: "active",
      employmentType: "full-time",
      skills: ["Customer Service", "Zendesk", "Troubleshooting"],
      notes: "New hire, showing great potential.",
      emergencyContact: {
        name: "Jordan Simmons",
        relation: "Sibling",
        phone: "+1 (555) 109-8765",
      },
      leaveBalance: 7,
      lastPromotionDate: null,
      manager: "Patricia Garcia",
      projects: ["Support System Migration", "Training Program"],
      isAdmin: false,
      attendance: {
        present: 100,
        absent: 0,
        late: 0,
      },
      performanceRating: 4.3,
    },
    {
      id: "EMP1010",
      employeeId: "EMP1010",
      name: "Albert Flores",
      email: "albert.flores@company.com",
      phone: "+1 (555) 012-3456",
      position: "Product Manager",
      department: "Product",
      role: "Manager",
      salary: 110000,
      joinDate: "2020-10-15",
      address: "2464 Royal Ln. Mesa, New Jersey 45463",
      status: "active",
      employmentType: "full-time",
      skills: ["Product Management", "Agile", "Roadmapping"],
      notes: "Leads the product team. Strong strategic thinker.",
      emergencyContact: {
        name: "Maria Flores",
        relation: "Wife",
        phone: "+1 (555) 098-7654",
      },
      leaveBalance: 20,
      lastPromotionDate: "2022-07-01",
      manager: "CEO",
      projects: ["New Product Launch", "Feature Prioritization"],
      isAdmin: true,
      attendance: {
        present: 96,
        absent: 4,
        late: 1,
      },
      performanceRating: 4.8,
    },
  ];

  // Filter staff
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch =
      staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.status || staff.status === filters.status) &&
      (!filters.department || staff.department === filters.department) &&
      (!filters.role || staff.role === filters.role) &&
      (!filters.joinDate || new Date(staff.joinDate) >= filters.joinDate) &&
      (filters.skills.length === 0 ||
        filters.skills.some((skill) => staff.skills.includes(skill))) &&
      (filters.isActive === null || staff.status !== "terminated");

    return matchesSearch && matchesFilters;
  });

  // Pagination
  const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff);
  const totalPages = Math.ceil(filteredStaff.length / staffPerPage);

  // Status badge with tooltip
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-100",
        icon: <BsCheckCircleFill className="mr-1" />,
        label: "Active",
      },
      probation: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-800 dark:text-blue-100",
        icon: <FiClock className="mr-1" />,
        label: "Probation",
      },
      "on-leave": {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-100",
        icon: <FiCalendar className="mr-1" />,
        label: "On Leave",
      },
      terminated: {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-100",
        icon: <FiX className="mr-1" />,
        label: "Terminated",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-100",
      icon: null,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    };

    return (
      <span
        className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Employment type indicator
  const getEmploymentTypeBadge = (type) => {
    const typeConfig = {
      "full-time": {
        bg: "bg-purple-100 dark:bg-purple-900",
        text: "text-purple-800 dark:text-purple-100",
        label: "Full-time",
      },
      "part-time": {
        bg: "bg-indigo-100 dark:bg-indigo-900",
        text: "text-indigo-800 dark:text-indigo-100",
        label: "Part-time",
      },
      contract: {
        bg: "bg-cyan-100 dark:bg-cyan-900",
        text: "text-cyan-800 dark:text-cyan-100",
        label: "Contract",
      },
      intern: {
        bg: "bg-orange-100 dark:bg-orange-900",
        text: "text-orange-800 dark:text-orange-100",
        label: "Intern",
      },
    };

    const config = typeConfig[type] || {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-100",
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };

    return (
      <span
        className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStaff.map((s) => ({
        "Employee ID": s.employeeId,
        Name: s.name,
        Position: s.position,
        Department: s.department,
        "Employment Type": s.employmentType,
        Status: s.status,
        "Join Date": s.joinDate,
        Manager: s.manager,
        Salary: `$${s.salary.toLocaleString()}`,
        "Leave Balance": s.leaveBalance,
        "Performance Rating": s.performanceRating,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
    XLSX.writeFile(
      workbook,
      `staff_report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Staff Management Report", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 22, {
      align: "center",
    });
    doc.text(
      `Filters: ${searchTerm ? `Search: "${searchTerm}"` : "None"}`,
      105,
      28,
      { align: "center" }
    );

    doc.autoTable({
      startY: 35,
      head: [
        [
          "ID",
          "Name",
          "Position",
          "Department",
          "Status",
          "Employment Type",
          "Salary",
          "Manager",
        ],
      ],
      body: filteredStaff.map((s) => [
        s.employeeId,
        s.name,
        s.position,
        s.department,
        s.status,
        s.employmentType,
        `$${s.salary.toLocaleString()}`,
        s.manager,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [229, 231, 235],
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save(`staff_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Staff details modal
  const StaffDetailsModal = ({ staff, onClose }) => {
    if (!staff) return null;

    // Chart data for attendance
    const attendanceData = {
      labels: ["Present", "Absent", "Late"],
      datasets: [
        {
          data: [
            staff.attendance.present,
            staff.attendance.absent,
            staff.attendance.late,
          ],
          backgroundColor: [
            "rgba(16, 185, 129, 0.7)",
            "rgba(239, 68, 68, 0.7)",
            "rgba(245, 158, 11, 0.7)",
          ],
        },
      ],
    };

    // Performance trend data
    const performanceData = {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Performance Rating",
          data: [4.2, 4.5, 4.7, staff.performanceRating],
          backgroundColor: "rgba(79, 70, 229, 0.7)",
        },
      ],
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[100vh] overflow-y-auto">
          <div className="p-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {staff.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {staff.position} • {staff.department}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150"
              >
                <FiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Staff Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg lg:col-span-1">
                <div className="flex items-center mb-4">
                  <Avatar
                    sx={{ width: 64, height: 64, bgcolor: "#4f46e5" }}
                    alt={staff.name}
                  >
                    {staff.name.charAt(0)}
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {staff.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">
                      ID: {staff.employeeId}
                    </div>
                    <div className="mt-1 flex gap-2">
                      {getStatusBadge(staff.status)}
                      {getEmploymentTypeBadge(staff.employmentType)}
                      {staff.isAdmin && (
                        <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
                          <FiShield className="mr-1" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMail className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {staff.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {staff.phone}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiHome className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {staff.address}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiBriefcase className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {staff.position}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <RiTeamLine className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {staff.department} • Reports to {staff.manager}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Joined on {new Date(staff.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      ${staff.salary.toLocaleString()} per year
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {staff.leaveBalance} days leave balance
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Emergency Contact
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FiUser className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {staff.emergencyContact.name} (
                        {staff.emergencyContact.relation})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiPhone className="text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {staff.emergencyContact.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Staff Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Performance Rating
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {staff.performanceRating}/5.0
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {staff.lastPromotionDate
                        ? `Last promoted on ${new Date(
                            staff.lastPromotionDate
                          ).toLocaleDateString()}`
                        : "No promotions yet"}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Attendance
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {staff.attendance.present}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {staff.attendance.absent} absences •{" "}
                      {staff.attendance.late} late arrivals
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Current Projects
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {staff.projects.length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {staff.projects.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Performance Trend
                  </h3>
                  <div className="h-64">
                    <Bar
                      data={performanceData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 5,
                          },
                        },
                        plugins: {
                          legend: {
                            position: "top",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Attendance Breakdown
                    </h3>
                    <div className="h-48">
                      <Pie
                        data={attendanceData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Skills & Notes
                    </h3>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {staff.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Notes
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {staff.notes || "No notes available."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150">
                Send Message
              </button>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition duration-150">
                Edit Profile
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition duration-150">
                Terminate Employment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bulk actions handler
  const handleBulkAction = () => {
    if (!bulkAction || selectedStaff.length === 0) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert(
        `${bulkAction} action performed on ${selectedStaff.length} staff members`
      );
      setSelectedStaff([]);
      setBulkAction("");
      setIsLoading(false);
    }, 1000);
  };

  // Toggle staff selection
  const toggleStaffSelection = (staffId) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedStaff.length === currentStaff.length) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(currentStaff.map((s) => s.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800">
        {/* Header with Actions */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Staff Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your organization's staff members and their details
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm transition duration-150 ease-in-out"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
            <div className="relative group">
              <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 shadow-sm transition duration-150 ease-in-out">
                <FiDownload className="mr-2" />
                Export
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 ease-in-out transform scale-95 group-hover:scale-100">
                <button
                  onClick={exportToExcel}
                  className="block px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as Excel
                </button>
                <button
                  onClick={exportToPDF}
                  className="block px-4 py-2 text-sm w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as PDF
                </button>
              </div>
            </div>
            <Link to="/dashboard/add-staff">
              <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition duration-150 ease-in-out">
                <FiPlus className="mr-2" />
                Add Staff
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Bulk Actions */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400 dark:text-gray-300" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search staff by name, ID, or position..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {selectedStaff.length > 0 && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              >
                <option value="">Bulk Actions</option>
                <option value="email">Send Email</option>
                <option value="message">Send Message</option>
                <option value="promote">Promote</option>
                <option value="terminate">Terminate</option>
                <option value="export">Export Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction || isLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
              >
                {isLoading ? "Processing..." : "Apply"}
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="probation">Probation</option>
                  <option value="on-leave">On Leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters({ ...filters, department: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Support">Support</option>
                  <option value="Design">Design</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Role
                </label>
                <select
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Roles</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Joined After
                </label>
                <DatePicker
                  selected={filters.joinDate}
                  onChange={(date) =>
                    setFilters({ ...filters, joinDate: date })
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                  placeholderText="Select date"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Skills
                </label>
                <MultiSelect
                  options={availableSkills.map((skill) => ({
                    label: skill,
                    value: skill,
                  }))}
                  value={filters.skills.map((skill) => ({
                    label: skill,
                    value: skill,
                  }))}
                  onChange={(selected) =>
                    setFilters({
                      ...filters,
                      skills: selected.map((item) => item.value),
                    })
                  }
                  labelledBy="Select skills"
                  className="bg-white dark:bg-gray-700"
                />
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isActive}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        isActive: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-200">
                    Active Employees Only
                  </span>
                </label>
              </div>

              <div className="flex items-end justify-end md:col-span-3">
                <button
                  onClick={() =>
                    setFilters({
                      status: "",
                      department: "",
                      role: "",
                      joinDate: null,
                      skills: [],
                      isActive: true,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition duration-150 ease-in-out"
                >
                  <FiX className="mr-1 inline" />
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="relative w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedStaff.length > 0 &&
                      selectedStaff.length === currentStaff.length
                    }
                    onChange={toggleSelectAll}
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Joined
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentStaff.length > 0 ? (
                currentStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => toggleStaffSelection(staff.id)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          sx={{ width: 40, height: 40, bgcolor: "#4f46e5" }}
                          alt={staff.name}
                        >
                          {staff.name.charAt(0)}
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                            {staff.name}
                            {staff.isAdmin && (
                              <FiShield className="ml-1 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {staff.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {staff.position}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getEmploymentTypeBadge(staff.employmentType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {staff.department}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Reports to {staff.manager}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(staff.joinDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.floor(
                          (new Date() - new Date(staff.joinDate)) /
                            (1000 * 60 * 60 * 24 * 365)
                        )}{" "}
                        years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(staff.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowStaffDetails(staff)}
                          className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="View Details"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-full text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Edit Staff"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="Terminate"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                          data-tooltip-id="action-tooltip"
                          data-tooltip-content="More Actions"
                        >
                          <BsThreeDotsVertical className="h-5 w-5" />
                        </button>
                        <Tooltip id="action-tooltip" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No staff members found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            Showing{" "}
            <span className="font-semibold">{indexOfFirstStaff + 1}</span> to{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastStaff, filteredStaff.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredStaff.length}</span>{" "}
            staff members
          </div>
          <nav
            className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span className="sr-only">Previous</span>
              <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = currentPage === pageNum;

              if (
                totalPages <= 7 ||
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition duration-150 ease-in-out ${
                      isCurrentPage
                        ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === currentPage - 3 && currentPage > 3) ||
                (pageNum === currentPage + 3 && currentPage < totalPages - 2)
              ) {
                return (
                  <span
                    key={pageNum}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              <span className="sr-only">Next</span>
              <FiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>

      {/* Staff Details Modal */}
      {showStaffDetails && (
        <StaffDetailsModal
          staff={showStaffDetails}
          onClose={() => setShowStaffDetails(null)}
        />
      )}
    </div>
  );
};

export default StaffManagement;
