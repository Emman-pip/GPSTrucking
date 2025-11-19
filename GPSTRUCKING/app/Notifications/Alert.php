<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Alert extends Notification
{
    use Queueable;

    protected string $title;
    protected string $message;
    protected array $tags;
    /**
     * Create a new notification instance.
     */
    public function __construct($title, $message, $tags)
    {
        $this->title = $title;
        $this->message = $message;
        $this->tags = $tags;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['broadcast', 'database']; // add mail here
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    public function toDatabase(object $notifiable) {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'tags' => $this->tags,
        ];
    }

    public function toBroadcast(object $notifiable) {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'tags' => $this->tags,
        ];
    }
}
