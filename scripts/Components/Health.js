// Health component stores information about a Character's max health, current health and how much damage they should take when hit

class Health {
    // Character's current health
    #currentHealth;

    // Character's max health
    #maxHealth;

    // How much damage the character receives (e.g. a character hit by a character with a power of 3 and a damage multiplier of 5 receives 15 damage)
    #damageMultiplier;


    // Initialise the Health component
    constructor(initialHealth, maxHealth, damageMultiplier) {
        this.#currentHealth = initialHealth;
        this.#maxHealth = maxHealth;
        this.#damageMultiplier = damageMultiplier;
    }

    // Access the Character's current health
    get currentHealth() {
        return this.#currentHealth;
    }

    // Change the character's current health (limited to its max health)
    set currentHealth(health) {
        this.#currentHealth = Math.min(health, this.#maxHealth);
    }

    // Access the Character's max health
    get maxHealth() {
        return this.#maxHealth;
    }

    // Reduce character's health. Use's opponent's power multiplied by Character's damage multiplier
    takeDamage(power) {
        this.#currentHealth -= power * this.#damageMultiplier;
    }

    // Check if Character is alive
    isAlive() {
        return this.#currentHealth > 0;
    }

}