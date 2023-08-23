const { dbtarget } = require("../../models/index");

    module.exports = {
      create: async (req, res) => {
        try {
          const instance = await dbtarget.Wheel.create(req.body);
          return res.status(201).json(instance);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      update: async (req, res) => {
        try {
          const [updatedRows] = await dbtarget.Wheel.update(req.body, {
            where: { id: req.params.id },
          });
          if (updatedRows === 0) {
            return res.status(404).json({ error: 'Wheel not found' });
          }
          return res.status(200).json({ message: 'Wheel updated successfully' });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      findAll: async (req, res) => {
        try {
          const instances = await dbtarget.Wheel.findAll();
          return res.status(200).json(instances);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      findById: async (req, res) => {
        try {
          const instance = await dbtarget.Wheel.findByPk(req.params.id);
          if (!instance) {
            return res.status(404).json({ error: 'Wheel not found' });
          }
          return res.status(200).json(instance);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      delete: async (req, res) => {
        try {
          const deletedRows = await dbtarget.Wheel.destroy({
            where: { id: req.params.id },
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: 'Wheel not found' });
          }
          return res.status(204).send(); 
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
    };
  