export default function validate (schema) {
    return (req, res, next) => {
        try {
            const validatedBody = schema.parse(req.body)
            req.body = validatedBody
            next()
        }catch (e) {
            const errors = []
            e.errors.forEach(error => {
                errors.push({field: error.path[0], message: error.message})
            });
            return res.status(400).json({errors})
        }
    }
}