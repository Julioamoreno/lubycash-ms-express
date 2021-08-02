exports.up = function(knex) {
    return knex.schema.createTable('Clients', table => {
        table.increments() // this represents the primary key.
        table.string('full_name', 140).notNullable()
        table.string('email', 140).notNullable().unique()
        table.integer('phone')
        table.string('cpf_number', 11).notNullable().unique()
        table.string('address', 180).notNullable()
        table.string('city', 80).notNullable()
        table.string('state', 22).notNullable()
        table.string('zipcode', 22).notNullable()
        table.double('current_balance').defaultTo(0.00)
        table.double('average_salary').notNullable()
        table.enu('status', ['pending', 'approved', 'disapproved']).defaultTo('pending') 
    })
};
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('Clients')
};