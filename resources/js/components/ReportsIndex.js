import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const ReportsIndex = () => {
    const [results, setResults] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({
        type: 'students',
        department_id: '',
        course_id: ''
    });
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        fetchDepartments();
        fetchCourses();
    }, []);

    useEffect(() => {
        if (filters.type) {
            generateReport();
        }
    }, [filters]);

    const fetchDepartments = async () => {
        try {
            const response = await fetch('/api/departments');
            const data = await response.json();
            setDepartments(data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses');
            const data = await response.json();
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const generateReport = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams(filters);
            const response = await fetch(`/api/admin/reports?${params}`);
            const data = await response.json();
            
            console.log('Reports API Response:', data); // Debug log
            
            if (data.error) {
                console.error('Reports API Error:', data.error);
            }
            
            setResults(data.results || []);
            setSummary(data.summary || {});
        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleGenerateDocument = async (e) => {
        e.preventDefault();
        
        if (selectedItems.length === 0) {
            alert('Please select at least one item to generate a report.');
            return;
        }
        
        try {
            setLoading(true);
            const params = new URLSearchParams({
                ...filters,
                selected_items: selectedItems.join(','),
                format: 'pdf'
            });
            
            const response = await fetch(`/api/admin/reports/generate?${params}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/pdf',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filters.type}_report_${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Error generating PDF report. Please try again.');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };
    
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(results.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };
    
    const getTableHeaders = () => {
        switch (filters.type) {
            case 'students':
                return ['Select', 'Name', 'Email', 'Department', 'Course', 'Academic Year', 'Status'];
            case 'faculties':
                return ['Select', 'Name', 'Email', 'Department', 'Position', 'Status'];
            case 'courses':
                return ['Select', 'Code', 'Title', 'Department', 'Enrolled Students', 'Status'];
            default:
                return ['Select', 'Code', 'Name', 'Courses', 'Faculty Members', 'Status'];
        }
    };

    const renderTableRow = (row) => {
        const isSelected = selectedItems.includes(row.id);
        
        switch (filters.type) {
            case 'students':
                return (
                    <>
                        <td>
                            <input 
                                type="checkbox" 
                                className="form-check-input"
                                checked={isSelected}
                                onChange={() => handleSelectItem(row.id)}
                            />
                        </td>
                        <td className="student-name">
                            {row.full_name}
                            {row.suffix && <span className="text-muted"> {row.suffix}</span>}
                        </td>
                        <td>{row.email || '—'}</td>
                        <td>{row.department?.name || '—'}</td>
                        <td>{row.course?.title || '—'}</td>
                        <td>{row.academic_year ? `${row.academic_year.start_year} - ${row.academic_year.end_year}` : '—'}</td>
                        <td><span className={`status-text status-${row.status?.toLowerCase()}`}>{row.status}</span></td>
                    </>
                );
            case 'faculties':
                return (
                    <>
                        <td>
                            <input 
                                type="checkbox" 
                                className="form-check-input"
                                checked={isSelected}
                                onChange={() => handleSelectItem(row.id)}
                            />
                        </td>
                        <td className="faculty-name">
                            {row.full_name}
                            {row.suffix && <span className="text-muted"> {row.suffix}</span>}
                        </td>
                        <td>{row.email || '—'}</td>
                        <td>{row.department?.name || '—'}</td>
                        <td>{row.position || '—'}</td>
                        <td><span className={`status-text status-${row.status?.toLowerCase()}`}>{row.status}</span></td>
                    </>
                );
            case 'courses':
                return (
                    <>
                        <td>
                            <input 
                                type="checkbox" 
                                className="form-check-input"
                                checked={isSelected}
                                onChange={() => handleSelectItem(row.id)}
                            />
                        </td>
                        <td>{row.code}</td>
                        <td>{row.title}</td>
                        <td>{row.department?.name || '—'}</td>
                        <td>
                            <span className="badge bg-info">
                                {row.students_count || 0} students
                            </span>
                        </td>
                        <td><span className={`status-text status-${row.status?.toLowerCase()}`}>{row.status}</span></td>
                    </>
                );
            default:
                return (
                    <>
                        <td>
                            <input 
                                type="checkbox" 
                                className="form-check-input"
                                checked={isSelected}
                                onChange={() => handleSelectItem(row.id)}
                            />
                        </td>
                        <td>{row.code}</td>
                        <td>{row.name}</td>
                        <td>
                            <span className="badge bg-primary me-1">
                                {row.courses_count || 0} courses
                            </span>
                        </td>
                        <td>
                            <span className="badge bg-success">
                                {row.faculty_count || 0} faculty
                            </span>
                        </td>
                        <td><span className={`status-text status-${row.status?.toLowerCase()}`}>{row.status}</span></td>
                    </>
                );
        }
    };

    return (
        <AdminLayout>
            <div className="reports-container">
                <div className="report-settings">
                    <div className="report-pill">⚙️ Report Settings</div>
                    <div className="report-panel">
                        <form onSubmit={handleGenerateDocument} className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Report Type</label>
                                <select 
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="form-select"
                                >
                                    <option value="students">Student Report</option>
                                    <option value="faculties">Faculty Report</option>
                                    <option value="courses">Course Report</option>
                                    <option value="departments">Department Report</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Filter by Department</label>
                                <select 
                                    value={filters.department_id}
                                    onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">All</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Filter by Course</label>
                                <select 
                                    value={filters.course_id}
                                    onChange={(e) => handleFilterChange('course_id', e.target.value)}
                                    className="form-select"
                                >
                                    <option value="">All</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <div className="text-muted">
                                    {selectedItems.length > 0 && (
                                        <span>{selectedItems.length} item(s) selected</span>
                                    )}
                                </div>
                                <button 
                                    type="submit" 
                                    className="report-generate"
                                    disabled={loading || selectedItems.length === 0}
                                >
                                    {loading ? 'Generating PDF...' : 'Generate PDF Document'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {Object.keys(summary).length > 0 && (
                    <div className="applied-filters">
                        <div className="filters-label">Applied Filters</div>
                        <div className="filters-list">
                            {Object.entries(summary).map(([key, value]) => (
                                <span key={key} className="filter-badge">{key}: {value}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="report-table">
                    <div className="report-card card">
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead>
                                    <tr>
                                        {getTableHeaders().map((header, index) => (
                                            <th key={header}>
                                                {header === 'Select' ? (
                                                    <input 
                                                        type="checkbox" 
                                                        className="form-check-input"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                    />
                                                ) : header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={getTableHeaders().length} className="text-center py-4">
                                                <div className="spinner-border spinner-border-sm" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : results.length > 0 ? (
                                        results.map((row, index) => (
                                            <tr key={index}>
                                                {renderTableRow(row)}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={getTableHeaders().length} className="empty-state">
                                                <div className="empty-icon">📊</div>
                                                <div className="empty-message">No report data found</div>
                                                <div className="empty-submessage">Try adjusting your filters or report type</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ReportsIndex;
