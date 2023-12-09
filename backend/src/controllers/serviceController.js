const { Service: serviceModel } = require("../models/serviceModel");
const fs = require('fs').promises;
const path = require('path');
const services = {
    create: async (req, res) => {
        try {
        const file = req.file;

        const serviceData = {
            name: req.body.name,
            description: req.body.description,
            categories:req.body.categories,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            image: file.filename,
            imageUrl: `${req.protocol}://${req.get('host')}/${file.filename}`,
        };

        const response = await serviceModel.create(serviceData);

        res.status(202).json({ response, msg: "Servicio creado" });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    getAll: async (req, res) => {
        try {
        const services = await serviceModel.find();
        res.json(services);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    get: async (req, res) => {
        try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);
        res.json(service);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    delete: async (req, res) => {
        try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);

        if (!service) {
            return res.status(404).json({ msg: "Servicio no encontrado." });
        }

        const imagePath = path.join(__dirname, "../uploads", service.image);

        // Elimina la imagen del sistema de archivos
        await fs.unlink(imagePath);

        const deletedService = await serviceModel.findByIdAndDelete(id);

        if (!deletedService) {
            return res.status(500).json({ msg: "Error al eliminar el servicio." });
        }

        res.status(200).json({ msg: "Servicio eliminado con éxito." });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    update :async (req, res) => {
        const id = req.params.id;
    
        try {
        let imagePath = null;
    
        if (req.file) {
            // Si se proporciona un nuevo archivo, actualiza la imagen
            imagePath = req.file.filename;
        }
    
        const service = {
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            steps: req.body.steps,
            categories: req.body.categories,
            image: imagePath, // Usa el nuevo nombre de archivo si hay uno, de lo contrario, mantén el existente
        };
    
        const updatedService = await serviceModel.findByIdAndUpdate(id, service, { new: true });
    
        if (!updatedService) {
            res.status(404).json({ msg: "Servicio no encontrado" });
            return;
        }
    
        res.status(200).json({ service: updatedService, msg: "Servicio actualizado con éxito" });
        } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
        }
    },
    
    getComments: async (req, res) => {
        try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);
    
        if (!service) {
            return res.status(404).json({ msg: "Servicio no encontrado." });
        }
    
        // Asegúrate de que la propiedad 'comments' esté presente en el objeto 'service'
        const comments = service.comments || [];
    
        res.status(200).json(comments);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    
    addComment: async (req, res) => {
    try {
        const id = req.params.id;
        const { user, text } = req.body;

        if (!user || !text) {
        return res.status(400).json({ error: 'Se requieren tanto el usuario como el texto del comentario.' });
        }

        const service = await serviceModel.findById(id);

        if (!service) {
        return res.status(404).json({ msg: "Servicio no encontrado." });
        }

        // Asegúrate de que estás utilizando el método push correctamente
        service.comments.push({ user, text });

        // Guarda el servicio después de agregar el comentario
        await service.save();

        // Devuelve el comentario recién agregado en la respuesta
        const newComment = service.comments[service.comments.length - 1];

        res.status(201).json({ msg: "Comentario agregado con éxito.", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }

    },

    // En el controlador
    addLike: async (req, res) => {
    try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);

        if (!service) {
        return res.status(404).json({ msg: "Servicio no encontrado." });
        }

        // Incrementa los "me gusta" y guarda el servicio
        service.likes += 1;
        await service.save();

        res.status(200).json({ msg: "Me gusta agregado con éxito.", likes: service.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    },


    getLikes:async (req, res) => {
    try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);

        if (!service) {
            return res.status(404).json({ msg: "Servicio no encontrado." });
        }

        res.json({ service, likes: service.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
    },

};

module.exports = services;
