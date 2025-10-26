<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\Department;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->input('type', 'students');
        $departmentId = $request->input('department_id');
        $courseId = $request->input('course_id');
        $selectedYear = $request->input('academic_year_id');

        $years = AcademicYear::orderByDesc('start_year')->get();
        $departments = Department::orderBy('name')->get(['id','name']);
        $courses = Course::orderBy('title')->get(['id','title']);

        // Build results based on type
        $results = collect();
        $summary = [];
        if ($type === 'students') {
            $query = Student::with(['department','course','academicYear']);
            if ($departmentId) $query->where('department_id', $departmentId);
            if ($courseId) $query->where('course_id', $courseId);
            $results = $query->orderBy('full_name')->paginate(10)->withQueryString();
            $summary = [
                'Department' => optional(Department::find($departmentId))->name ?: 'All',
                'Course' => optional(Course::find($courseId))->title ?: 'All',
            ];
        } elseif ($type === 'faculties') {
            $query = Faculty::with('department');
            if ($departmentId) $query->where('department_id', $departmentId);
            $results = $query->orderBy('full_name')->paginate(10)->withQueryString();
            $summary = [
                'Department' => optional(Department::find($departmentId))->name ?: 'All',
            ];
        } elseif ($type === 'courses') {
            $query = Course::with('department');
            if ($departmentId) $query->where('department_id', $departmentId);
            $results = $query->orderBy('code')->paginate(10)->withQueryString();
            $summary = [
                'Department' => optional(Department::find($departmentId))->name ?: 'All',
            ];
        } else { // departments
            $results = Department::orderBy('code')->paginate(10)->withQueryString();
        }

        return view('layouts.admin-react', compact(
            'type','departmentId','courseId','years','selectedYear','departments','courses','results','summary'
        ));
    }

    public function export(string $type)
    {
        // Placeholder – can be wired to CSV/Excel later
        $dept = request('department_id');
        $course = request('course_id');
        $msg = strtoupper($type).' report will be generated'.
            ($dept ? ' for Department ID '.$dept : '').
            ($course ? ' and Course ID '.$course : '');
        return back()->with('success', $msg);
    }

    /**
     * API method to get reports data for React components
     */
    public function apiIndex(Request $request)
    {
        $type = $request->input('type', 'students');
        $departmentId = $request->input('department_id');
        $courseId = $request->input('course_id');

        $results = collect();
        if ($type === 'students') {
            $query = Student::with(['department','course','academicYear']);
            if ($departmentId) $query->where('department_id', $departmentId);
            if ($courseId) $query->where('course_id', $courseId);
            $results = $query->orderBy('full_name')->get();
        } elseif ($type === 'faculties') {
            $query = Faculty::with('department');
            if ($departmentId) $query->where('department_id', $departmentId);
            $results = $query->orderBy('full_name')->get();
        } elseif ($type === 'courses') {
            $query = Course::with('department')
                ->withCount([
                    'students' => function ($query) {
                        $query->whereNull('deleted_at');
                    }
                ]);
            if ($departmentId) $query->where('department_id', $departmentId);
            $results = $query->orderBy('code')->get();
        } else {
            $results = Department::withCount([
                'courses' => function ($query) {
                    $query->whereNull('deleted_at');
                },
                'faculties' => function ($query) {
                    $query->whereNull('deleted_at');
                }
            ])->orderBy('code')->get();
        }

        return response()->json([
            'results' => $results,
            'summary' => [
                'type' => $type,
                'department_id' => $departmentId,
                'course_id' => $courseId,
                'total' => $results->count()
            ]
        ]);
    }

    /**
     * Generate PDF report for selected items
     */
    public function generatePdf(Request $request)
    {
        $type = $request->input('type', 'students');
        $selectedItems = explode(',', $request->input('selected_items', ''));
        $departmentId = $request->input('department_id');
        $courseId = $request->input('course_id');

        if (empty($selectedItems)) {
            return response()->json(['error' => 'No items selected'], 400);
        }

        $data = [];
        $title = '';
        
        switch ($type) {
            case 'students':
                $data = Student::with(['department', 'course', 'academicYear'])
                    ->whereIn('id', $selectedItems)
                    ->orderBy('full_name')
                    ->get();
                $title = 'Student Report';
                break;
                
            case 'faculties':
                $data = Faculty::with('department')
                    ->whereIn('id', $selectedItems)
                    ->orderBy('full_name')
                    ->get();
                $title = 'Faculty Report';
                break;
                
            case 'courses':
                $data = Course::with([
                        'department',
                        'students' => function ($query) {
                            $query->whereNull('deleted_at');
                        }
                    ])
                    ->withCount([
                        'students' => function ($query) {
                            $query->whereNull('deleted_at');
                        }
                    ])
                    ->whereIn('id', $selectedItems)
                    ->orderBy('code')
                    ->get();
                $title = 'Course Report';
                break;
                
            case 'departments':
                $data = Department::with([
                        'courses' => function ($query) {
                            $query->whereNull('deleted_at');
                        },
                        'faculties' => function ($query) {
                            $query->whereNull('deleted_at');
                        }
                    ])
                    ->withCount([
                        'courses' => function ($query) {
                            $query->whereNull('deleted_at');
                        },
                        'faculties' => function ($query) {
                            $query->whereNull('deleted_at');
                        }
                    ])
                    ->whereIn('id', $selectedItems)
                    ->orderBy('code')
                    ->get();
                $title = 'Department Report';
                break;
        }

        $pdf = Pdf::loadView('reports.pdf', [
            'data' => $data,
            'type' => $type,
            'title' => $title,
            'generated_at' => now()->format('F j, Y g:i A')
        ]);

        return $pdf->download($type . '_report_' . date('Y-m-d') . '.pdf');
    }

    /**
     * Get detailed information for a specific item
     */
    public function getItemDetails(Request $request, $type, $id)
    {
        switch ($type) {
            case 'students':
                $item = Student::with(['department', 'course', 'academicYear'])->find($id);
                break;
            case 'faculties':
                $item = Faculty::with('department')->find($id);
                break;
            case 'courses':
                $item = Course::with(['department', 'students'])
                    ->withCount([
                        'students' => function ($query) {
                            $query->whereNull('deleted_at');
                        }
                    ])
                    ->find($id);
                break;
            case 'departments':
                $item = Department::with(['courses', 'faculties'])
                    ->withCount([
                        'courses' => function ($query) {
                            $query->whereNull('deleted_at');
                        },
                        'faculties' => function ($query) {
                            $query->whereNull('deleted_at');
                        }
                    ])
                    ->find($id);
                break;
            default:
                return response()->json(['error' => 'Invalid type'], 400);
        }

        if (!$item) {
            return response()->json(['error' => 'Item not found'], 404);
        }

        return response()->json($item);
    }
}
