const { dbtarget } = require("../../models/index");

    module.exports = {
      create: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const instance = await dbt.Test.create(req.body);
          return res.status(201).json(instance);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      update: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const [updatedRows] = await dbt.Test.update(req.body, {
            where: { id: req.params.id },
          });
          if (updatedRows === 0) {
            return res.status(404).json({ error: 'Test not found' });
          }
          return res.status(200).json({ message: 'Test updated successfully' });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      findAll: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const instances = await dbt.Test.findAll();
          return res.status(200).json(instances);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      findById: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const instance = await dbt.Test.findByPk(req.params.id);
          if (!instance) {
            return res.status(404).json({ error: 'Test not found' });
          }
          return res.status(200).json(instance);
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
      delete: async (req, res) => {
        try {
          const dbt = await dbtarget;
          const deletedRows = await dbt.Test.destroy({
            where: { id: req.params.id },
          });
          if (deletedRows === 0) {
            return res.status(404).json({ error: 'Test not found' });
          }
          return res.status(204).send(); 
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      },
    };
  