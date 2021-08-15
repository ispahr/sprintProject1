const { Sequelize, DataTypes } = require('sequelize');

function modelUsers(connection) {
    const Users = connection.define('Users',{
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        userName:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber:{
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        admin:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    })

    return Users
}

module.exports = modelUsers