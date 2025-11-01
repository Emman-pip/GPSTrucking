<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'role' => [ 'required', 'string' ],
            'password' => $this->passwordRules(),
        ])->validate();

        $input['role'] = ($input['role'] === 'Barangay Official') ? 3 : 2;

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'role_id' => $input['role'],
            'password' => $input['password'],
        ]);
    }
}
