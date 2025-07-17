<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'email' => 'test1@example.com',
                'password' => Hash::make('password123'),
            ],
            [
                'email' => 'test2@example.com',
                'password' => Hash::make('password123'),
            ],
            [
                'email' => 'test3@example.com',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }
    }
}