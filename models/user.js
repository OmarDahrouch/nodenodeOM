const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    Nom_Complet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    MotDePasse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Avant de créer un nouvel utilisateur, on hash son mot de passe
  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.MotDePasse, 10);
    user.MotDePasse = hashedPassword;
  });

  // Méthode pour vérifier le mot de passe d'un utilisateur
  User.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.MotDePasse);
  };

  return User;
};
