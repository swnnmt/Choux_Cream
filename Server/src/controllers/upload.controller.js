const uploadMedia = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false });
  }

    res.json({
    success: true,
    data: {
        url: req.file.path,
        publicId: req.file.filename,
        type: req.file.resource_type,
        size: req.file.bytes,
        format: req.file.format,
    },
    });
};

module.exports = { uploadMedia };
