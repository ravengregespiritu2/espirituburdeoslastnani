<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 15px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 24px;
        }
        .header .subtitle {
            color: #666;
            margin: 5px 0;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-section h3 {
            color: #007bff;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
            color: #495057;
        }
        .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: bold;
            border-radius: 3px;
            color: white;
        }
        .badge-success { background-color: #28a745; }
        .badge-info { background-color: #17a2b8; }
        .badge-primary { background-color: #007bff; }
        .badge-secondary { background-color: #6c757d; }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .detail-section {
            margin-bottom: 25px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .detail-section h4 {
            margin-top: 0;
            color: #007bff;
        }
        .detail-grid {
            display: table;
            width: 100%;
        }
        .detail-row {
            display: table-row;
        }
        .detail-label {
            display: table-cell;
            font-weight: bold;
            padding: 5px 10px 5px 0;
            width: 150px;
        }
        .detail-value {
            display: table-cell;
            padding: 5px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>FENKABLE UNIVERSITY</h1>
        <div class="subtitle">{{ $title }}</div>
        <div class="subtitle">Generated on {{ $generated_at }}</div>
    </div>

    @if($type === 'students')
        @foreach($data as $student)
            <div class="detail-section">
                <h4>{{ $student->full_name }}{{ $student->suffix ? ' ' . $student->suffix : '' }}</h4>
                <div class="detail-grid">
                    <div class="detail-row">
                        <div class="detail-label">Email:</div>
                        <div class="detail-value">{{ $student->email ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Sex:</div>
                        <div class="detail-value">{{ $student->sex ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Birthdate:</div>
                        <div class="detail-value">{{ $student->birthdate ? \Carbon\Carbon::parse($student->birthdate)->format('F j, Y') : 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Contact Number:</div>
                        <div class="detail-value">{{ $student->contact_number ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Address:</div>
                        <div class="detail-value">{{ $student->address ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Department:</div>
                        <div class="detail-value">{{ $student->department->name ?? 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Course:</div>
                        <div class="detail-value">{{ $student->course->title ?? 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Academic Year:</div>
                        <div class="detail-value">
                            {{ $student->academicYear ? $student->academicYear->start_year . ' - ' . $student->academicYear->end_year : 'N/A' }}
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="badge badge-{{ $student->status === 'active' ? 'success' : 'secondary' }}">
                                {{ ucfirst($student->status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach

    @elseif($type === 'faculties')
        @foreach($data as $faculty)
            <div class="detail-section">
                <h4>{{ $faculty->full_name }}{{ $faculty->suffix ? ' ' . $faculty->suffix : '' }}</h4>
                <div class="detail-grid">
                    <div class="detail-row">
                        <div class="detail-label">Email:</div>
                        <div class="detail-value">{{ $faculty->email ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Sex:</div>
                        <div class="detail-value">{{ $faculty->sex ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Birthdate:</div>
                        <div class="detail-value">{{ $faculty->birthdate ? \Carbon\Carbon::parse($faculty->birthdate)->format('F j, Y') : 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Contact Number:</div>
                        <div class="detail-value">{{ $faculty->contact_number ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Address:</div>
                        <div class="detail-value">{{ $faculty->address ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Department:</div>
                        <div class="detail-value">{{ $faculty->department->name ?? 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Position:</div>
                        <div class="detail-value">{{ $faculty->position ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="badge badge-{{ $faculty->status === 'active' ? 'success' : 'secondary' }}">
                                {{ ucfirst($faculty->status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach

    @elseif($type === 'courses')
        @foreach($data as $course)
            <div class="detail-section">
                <h4>{{ $course->code }} - {{ $course->title }}</h4>
                <div class="detail-grid">
                    <div class="detail-row">
                        <div class="detail-label">Department:</div>
                        <div class="detail-value">{{ $course->department->name ?? 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Units:</div>
                        <div class="detail-value">{{ $course->units ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Enrolled Students:</div>
                        <div class="detail-value">
                            <span class="badge badge-info">{{ $course->students_count }} students</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="badge badge-{{ $course->status === 'active' ? 'success' : 'secondary' }}">
                                {{ ucfirst($course->status) }}
                            </span>
                        </div>
                    </div>
                </div>
                
                @if($course->students && $course->students->count() > 0)
                    <div class="info-section">
                        <h3>Enrolled Students</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Academic Year</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($course->students as $student)
                                    <tr>
                                        <td>{{ $student->full_name }}{{ $student->suffix ? ' ' . $student->suffix : '' }}</td>
                                        <td>{{ $student->email ?: 'N/A' }}</td>
                                        <td>{{ $student->academicYear ? $student->academicYear->start_year . ' - ' . $student->academicYear->end_year : 'N/A' }}</td>
                                        <td>
                                            <span class="badge badge-{{ $student->status === 'active' ? 'success' : 'secondary' }}">
                                                {{ ucfirst($student->status) }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>
        @endforeach

    @elseif($type === 'departments')
        @foreach($data as $department)
            <div class="detail-section">
                <h4>{{ $department->code }} - {{ $department->name }}</h4>
                <div class="detail-grid">
                    <div class="detail-row">
                        <div class="detail-label">Location:</div>
                        <div class="detail-value">{{ $department->location ?: 'N/A' }}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Total Courses:</div>
                        <div class="detail-value">
                            <span class="badge badge-primary">{{ $department->courses_count }} courses</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Faculty Members:</div>
                        <div class="detail-value">
                            <span class="badge badge-success">{{ $department->faculties_count }} faculty</span>
                        </div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div class="detail-value">
                            <span class="badge badge-{{ $department->status === 'active' ? 'success' : 'secondary' }}">
                                {{ ucfirst($department->status) }}
                            </span>
                        </div>
                    </div>
                </div>

                @if($department->courses && $department->courses->count() > 0)
                    <div class="info-section">
                        <h3>Courses Offered</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Title</th>
                                    <th>Units</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($department->courses as $course)
                                    <tr>
                                        <td>{{ $course->code }}</td>
                                        <td>{{ $course->title }}</td>
                                        <td>{{ $course->units ?: 'N/A' }}</td>
                                        <td>
                                            <span class="badge badge-{{ $course->status === 'active' ? 'success' : 'secondary' }}">
                                                {{ ucfirst($course->status) }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif

                @if($department->faculties && $department->faculties->count() > 0)
                    <div class="info-section">
                        <h3>Faculty Members</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($department->faculties as $faculty)
                                    <tr>
                                        <td>{{ $faculty->full_name }}{{ $faculty->suffix ? ' ' . $faculty->suffix : '' }}</td>
                                        <td>{{ $faculty->email ?: 'N/A' }}</td>
                                        <td>{{ $faculty->position ?: 'N/A' }}</td>
                                        <td>
                                            <span class="badge badge-{{ $faculty->status === 'active' ? 'success' : 'secondary' }}">
                                                {{ ucfirst($faculty->status) }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>
        @endforeach
    @endif

    <div class="footer">
        <p>This report was generated from the Fenkable University Management System.</p>
        <p>© {{ date('Y') }} Fenkable University. All rights reserved.</p>
    </div>
</body>
</html>
