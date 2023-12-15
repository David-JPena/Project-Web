const { Service: serviceModel } = require("../models/serviceModel");
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

// Definición del objeto 'services' que contiene diferentes métodos para operaciones CRUD
const services = {
    // Método para crear un nuevo servicio
    create: async (req, res) => {
        try {
        const file = req.file;

        const serviceData = {
            name: req.body.name,
            description: req.body.description,
            categories:req.body.categories,
            ingredients: req.body.ingredients.split(',').map(ingredient => ingredient.trim()),
            steps: req.body.steps.split(',').map(step => step.trim()),
            image: file.filename,// Asigna el nombre del archivo a la propiedad 'image'
            imageUrl: `${req.protocol}://${req.get('host')}/${file.filename}`,// Construye la URL completa para la imagen cargada
            origin: req.body.origin,
            createdBy: req.userId,
        };

        const response = await serviceModel.create(serviceData);

        res.status(202).json({ response, msg: "Servicio creado" });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    // Método para obtener todos los servicios
    getAll: async (req, res) => {
        try {
        const services = await serviceModel.find();
        res.json(services);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },
   // Método para obtener un servicio por ID
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
 // Método para eliminar un servicio por ID
    delete: async (req, res) => {
        try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);

        if (!service) {
            return res.status(404).json({ msg: "Servicio no encontrado." });
        }
 // Construir la ruta de la imagen en el sistema de archivos
        const imagePath = path.join(__dirname, "../../uploads", service.image);

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
// Método para actualizar un servicio por ID
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
            image: imagePath, 
            origin: req.body.origin,
        };
            // Utiliza el método findByIdAndUpdate para actualizar el servicio por su ID
        // El tercer parámetro { new: true } devuelve el documento actualizado
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
    // Métodos para gestionar comentarios en un servicio
    
    getComments: async (req, res) => {
        try {
        const id = req.params.id;
        const service = await serviceModel.findById(id);
    
        if (!service) {
            return res.status(404).json({ msg: "Servicio no encontrado." });
        }
    
       // Obtiene el comentario del cuerpo de la solicitud
        const comments = service.comments || [];
    
        res.status(200).json(comments);
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    
     addComment : async (req, res) => {
        try {
            const id = req.params.id;
            const { text } = req.body;
    
            // Validar el ID del servicio
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ success: false, error: 'ID de servicio no válido.' });
            }
    
            // Obtener el objeto de usuario autenticado
            const user = req.userId; 
    
            // Validar la presencia de usuario y texto del comentario
            if (!user || !text) {
                return res.status(400).json({ success: false, error: 'Se requiere tanto el usuario como el texto del comentario.' });
            }
    
            // Buscar el servicio por ID
            const service = await serviceModel.findById(id);
    
            if (!service) {
                return res.status(404).json({ success: false, error: "Servicio no encontrado." });
            }
    
            // Agregar el comentario al servicio y guardar
            service.comments.push({ user, text });
            await service.save();
    
            // Obtener el comentario recién agregado
            const newComment = service.comments[service.comments.length - 1];
    
            // Respuesta exitosa con el nuevo comentario
            res.status(201).json({ success: true, msg: "Comentario agregado con éxito.", comment: newComment });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: "Error interno del servidor" });
        }
    },
     // Método para buscar servicios por nombre
    searchByName: async (req, res) => {
        try {
          const searchTerm = req.query.name;
    
          // Realiza la búsqueda por nombre en el modelo de servicio
          const results = await serviceModel.find({ name: { $regex: searchTerm, $options: 'i' } });
    
          res.status(200).json(results);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
      },
    

    
    
    
// Métodos para gestionar "Me gusta" en un servicio
    addLike : async (req, res) => {
        try {
            const serviceId = req.params.id;
            const userId = req.userId;
    
            const service = await serviceModel.findById(serviceId);
    
            if (!service) {
                return res.status(404).json({ msg: "Servicio no encontrado." });
            }
    
            // Verifica si el usuario ya dio "Me gusta"
            if (service.likesBy.includes(userId)) {
                return res.status(400).json({ msg: "Ya has dado Me gusta a este servicio." });
            }
    
            // Agrega el ID del usuario a la lista de "Me gusta" y guarda el servicio
            service.likesBy.push(userId);
            // Incrementa el contador de "Me gusta"
            service.likes += 1;
    
            await service.save();
    
            res.status(200).json({ msg: "Me gusta agregado con éxito.", likes: service.likes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },


    removeLike: async (req, res) => {
        try {
            const serviceId = req.params.id;
            const userId = req.userId;
    
            const service = await serviceModel.findById(serviceId);
    
            if (!service) {
                return res.status(404).json({ msg: "Servicio no encontrado." });
            }
    
            // Verifica si el usuario ya dio "Me gusta"
            const index = service.likesBy.indexOf(userId);
            if (index === -1) {
                return res.status(400).json({ msg: "No has dado Me gusta a este servicio." });
            }
    
            // Remueve el ID del usuario de la lista de "Me gusta"
            service.likesBy.splice(index, 1);
            // Decrementa el contador de "Me gusta"
            service.likes -= 1;
    
            // Guarda el servicio con las modificaciones
            await service.save();
    
            res.status(200).json({ msg: "Me gusta eliminado con éxito.", likes: service.likes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
    
     // Método para buscar servicios por categoría
    searchByCategory: async (req, res) => {
        try {
            const category = req.query.category;
    
            if (!category) {
                return res.status(400).json({ error: 'Se requiere una categoría para realizar la búsqueda.' });
            }
    
            const matchingServices = await serviceModel.find({ categories: category });
    
            if (matchingServices.length === 0) {
                return res.status(404).json({ msg: "No se encontraron servicios en la categoría proporcionada." });
            }
    
            res.status(200).json(matchingServices);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

// Método para obtener servicios creados por un usuario específico
    getUserServices: async (req, res) => {
        try {
            const userId = req.userId; // ID del usuario actual
            const userServices = await serviceModel.find({ createdBy: userId });
            res.json(userServices);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
      
};

module.exports = services;
