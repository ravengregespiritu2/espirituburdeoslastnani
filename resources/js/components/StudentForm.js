import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

const StudentForm = ({ student = null, isEdit = false }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        suffix: '',
        sex: '',
        birthdate: '',
        email: '',
        contact_number: '',
        address: '',
        course_id: '',
        department_id: '',
        academic_year_id: '',
        status: 'active'
    });
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [academicYears, setAcademicYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchDepartments();
        fetchCourses();
        fetchAcademicYears();
        if (student) {
            setFormData({
                full_name: student.full_name || '',
                suffix: student.suffix || '',
                sex: student.sex || '',
                birthdate: student.birthdate || '',
                email: student.email || '',
                contact_number: student.contact_number || '',
                address: student.address || '',
                course_id: student.course_id || '',
                department_id: student.department_id || '',
                academic_year_id: student.academic_year_id || '',
                status: student.status || 'active'
            });
        }
    }, [student]);

    // Filter courses when courses are loaded and student has a department
    useEffect(() => {
        if (student && student.department_id && courses.length > 0) {
            const departmentCourses = courses.filter(course => 
                course.department_id === parseInt(student.department_id)
            );
            setFilteredCourses(departmentCourses);
        }
    }, [courses, student]);

    const fetchDepartments = async () => {
        try {
            console.log('Fetching departments...');
            const response = await fetch('/api/departments', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            const data = await response.json();
            console.log('Departments response:', data);
            setDepartments(data || []);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            const data = await response.json();
            setCourses(data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchAcademicYears = async () => {
        try {
            console.log('Fetching academic years...');
            const response = await fetch('/api/admin/academic-years', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });
            const data = await response.json();
            console.log('Academic years response:', data);
            setAcademicYears(data || []);
        } catch (error) {
            console.error('Error fetching academic years:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // If department changes, filter courses and clear course selection
        if (name === 'department_id') {
            const departmentCourses = courses.filter(course => 
                course.department_id === parseInt(value)
            );
            setFilteredCourses(departmentCourses);
            
            // Clear course selection when department changes
            setFormData(prev => ({
                ...prev,
                course_id: ''
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const url = isEdit ? `/api/admin/students/${student.id}` : '/api/admin/students';
            const method = isEdit ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(isEdit ? 'Student updated successfully!' : 'Student created successfully!');
                window.location.href = '/admin/students';
            } else {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    alert('Error: ' + (data.message || 'Something went wrong'));
                }
            }
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Error saving student. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{isEdit ? 'Edit Student' : 'New Student'}</h4>
                <a href="/admin/students" className="btn btn-outline-secondary">← Back to Students</a>
            </div>

            <div className="form-container">
                <div className="form-card">
                    <div className="form-header">
                        <div className="form-title">{isEdit ? 'Edit Student Information' : 'Add New Student'}</div>
                        <div className="form-subtitle">Fill in the student details below</div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g., Raven Greg"
                                    required
                                />
                                {errors.full_name && <div className="invalid-feedback">{errors.full_name[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Suffix</label>
                                <select
                                    name="suffix"
                                    className={`form-select ${errors.suffix ? 'is-invalid' : ''}`}
                                    value={formData.suffix}
                                    onChange={handleChange}
                                >
                                    <option value="">— Select Suffix —</option>
                                    <option value="Jr.">Jr.</option>
                                    <option value="Sr.">Sr.</option>
                                    <option value="II">II</option>
                                    <option value="III">III</option>
                                    <option value="IV">IV</option>
                                </select>
                                {errors.suffix && <div className="invalid-feedback">{errors.suffix[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Sex *</label>
                                <select
                                    name="sex"
                                    className={`form-select ${errors.sex ? 'is-invalid' : ''}`}
                                    value={formData.sex}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">— Select Sex —</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                {errors.sex && <div className="invalid-feedback">{errors.sex[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Birthdate</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                />
                                {errors.birthdate && <div className="invalid-feedback">{errors.birthdate[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    className={`form-control ${errors.contact_number ? 'is-invalid' : ''}`}
                                    value={formData.contact_number}
                                    onChange={handleChange}
                                    placeholder="e.g., 09649887606"
                                />
                                {errors.contact_number && <div className="invalid-feedback">{errors.contact_number[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Department *</label>
                                <select
                                    name="department_id"
                                    className={`form-select ${errors.department_id ? 'is-invalid' : ''}`}
                                    value={formData.department_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">— Select Department —</option>
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </select>
                                {errors.department_id && <div className="invalid-feedback">{errors.department_id[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Course *</label>
                                <select
                                    name="course_id"
                                    className={`form-select ${errors.course_id ? 'is-invalid' : ''}`}
                                    value={formData.course_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">— Select Course —</option>
                                    {!formData.department_id && (
                                        <option value="" disabled>Please select a department first</option>
                                    )}
                                    {filteredCourses.map(course => (
                                        <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
                                    ))}
                                </select>
                                {errors.course_id && <div className="invalid-feedback">{errors.course_id[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Academic Year</label>
                                <select
                                    name="academic_year_id"
                                    className={`form-select ${errors.academic_year_id ? 'is-invalid' : ''}`}
                                    value={formData.academic_year_id}
                                    onChange={handleChange}
                                >
                                    <option value="">— Select Academic Year —</option>
                                    {academicYears.map(year => (
                                        <option key={year.id} value={year.id}>
                                            {year.start_year} - {year.end_year}
                                        </option>
                                    ))}
                                </select>
                                {errors.academic_year_id && <div className="invalid-feedback">{errors.academic_year_id[0]}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    name="status"
                                    className="form-select"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="graduated">Graduated</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <textarea
                                    name="address"
                                    className="form-control"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button 
                                type="submit" 
                                className="btn btn-brand"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Create Student')}
                            </button>
                            <a href="/admin/students" className="btn btn-outline-secondary">
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default StudentForm;
