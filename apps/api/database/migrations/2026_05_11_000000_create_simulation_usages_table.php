<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('simulation_usages', function (Blueprint $table) {
            $table->id();
            $table->string('simulation')->index();
            $table->string('anon_token')->index();
            $table->string('ip_address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->timestamp('used_at')->index();
            $table->timestamps();

            $table->index(['simulation', 'anon_token', 'used_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('simulation_usages');
    }
};
