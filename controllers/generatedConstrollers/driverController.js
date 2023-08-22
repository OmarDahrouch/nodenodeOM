const { targetDbSequelize } = require("../models/index");

    module.exports = {
      create: async (req, res) => {
        try {
          const instance = await targetDbSequelize.Driver.create(req.body);
          return res.status(201).json(instance);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      update: async (req, res) => {
        try {
          const [updatedRows] = await targetDbSequelize.Driver.update(req.body, {
            where: { id: req.params.id },
          });
          if (updatedRows === 0) {
            return res.status(404).json({ error: 'Driver not found' });
          }
          return res.status(200).json({ message: 'Driver updated successfully' });
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      findAll: async (req, res) => {
        try {
          const instances = await targetDbSequelize.Driver.findAll();
          return res.status(200).json(instances);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      findById: async (req, res) => {
        try {
          const instance = await targetDbSequelize.Driver.findByPk(req.params.id);
          if (!instance) {
            return res.status(404).json({ error: 'Driver not found' });
          }
          return res.status(200).json(instance);
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
      delete: async (req, res) => {
        try {
          const deletedRows = await targetDbSequelize.Driver.destroy({
            where: { id: req.params.id },
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: 'Driver not found' });
          }
          return res.status(204).send(); 
        } catch (error) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
      },
    };
  