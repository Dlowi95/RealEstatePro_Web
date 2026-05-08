<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Hello', [
        'user' => 'Gia Huy'
    ]);
});

Route::get('/test-db', function () {
    try {
        // Kiểm tra kết nối bằng cách lấy danh sách database
        $databases = DB::connection('mongodb')->getMongoClient()->listDatabases();
        
        return response()->json([
            'status' => 'Success',
            'message' => 'Kết nối MongoDB Atlas thành công!',
            'data' => $databases
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'Error',
            'message' => 'Không thể kết nối MongoDB: ' . $e->getMessage()
        ], 500);
    }
});