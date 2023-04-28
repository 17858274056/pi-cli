export const props = {
    prefix: {
        type: String,
        default: "icon",
    },
    size: {
        type: [Number, String],
        default: 16
    },
    name: {
        type: String,
        required: true,
    }
}
