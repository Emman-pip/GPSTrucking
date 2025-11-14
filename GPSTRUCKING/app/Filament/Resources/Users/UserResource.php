<?php

namespace App\Filament\Resources\Users;

use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\Pages\ViewUser;
use App\Filament\Resources\Users\Schemas\UserForm;
use App\Filament\Resources\Users\Tables\UsersTable;
use App\Models\User;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Users';

    public static function form(Schema $schema): Schema
    {
        return UserForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UsersTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
            'view' => ViewUser::route('/{record}'),
        ];
    }

    public static function infolist(Schema $schema): Schema
    {
        $record = $schema->getRecord();
        $role = $record->role->name;
        if ($role === 'barangay') {
            return $schema
                ->components([
                    Section::make('Account Information')
                        ->schema([

                            TextEntry::make('name')
                                ->inlineLabel(),

                            TextEntry::make('email')
                                ->inlineLabel(),
                            TextEntry::make('role.name')
                                ->label('Role')
                                ->inlineLabel(),
                        ])
                        ->columnSpanFull(),
                    Section::make('Details')
                        ->schema([
                            TextEntry::make('barangayOfficialInfo.proof_of_identity')
                                ->label('Proof of Identity')
                                ->icon(Heroicon::OutlinedEye)
                                ->formatStateUsing(fn($record) => 'View Valid ID')
                                ->url(fn($record) => '/storage/' . $record->barangayOfficialInfo->proof_of_identity)
                                ->openUrlInNewTab()
                                ->inlineLabel(),
                            TextEntry::make('barangayOfficialInfo.barangay_official_id')
                                ->label('Barangay ID')
                                ->icon(Heroicon::OutlinedEye)
                                ->formatStateUsing(fn($record) => 'View barangay ID')
                                ->url(fn($record) => '/storage/' . $record->barangayOfficialInfo->proof_of_identity)
                                ->openUrlInNewTab()
                                ->inlineLabel(),
                            TextEntry::make('barangayOfficialInfo.contact_number')
                                ->label('Contact number')
                                ->icon(Heroicon::DevicePhoneMobile)
                                ->inlineLabel(),
                        ])
                        ->visible(fn($record) => ! is_null($record->barangayOfficialInfo))
                        ->headerActions(
                            [
                                Action::make('toggleVerified')
                                    ->label(fn($record) => $record->isVerified ? 'Unverify' : 'Verify')
                                    ->icon(
                                        fn($record) => $record->isVerified
                                            ? 'heroicon-o-x-circle'
                                            : 'heroicon-o-check-circle'
                                    )
                                    ->color(fn($record) => $record->isVerified ? 'danger' : 'success')
                                    ->action(function ($record) {
                                        $record->isVerified = ! $record->isVerified;
                                        $record->save();
                                    })
                            ]

                        )
                        ->columnSpanFull(),
                ]);
        }
        return $schema->components([
            Section::make("Account Information")
                ->schema([
                    TextEntry::make('name')
                        ->inlineLabel(),

                    TextEntry::make('email')
                        ->inlineLabel(),
                    TextEntry::make('role.name')
                        ->label('Role')
                        ->inlineLabel(),
                ])
                ->columnSpanFull(),
            Section::make("Residency Information")
                ->schema([
                    TextEntry::make('residency.barangayID.name')
                        ->label('Barangay')
                        ->inlineLabel(),
                ])
                ->visible(fn($record) => ! is_null($record->residency))
                ->columnSpanFull()
        ]);
    }
}
