const fsu = require('./fs-utils');
const fs = require('fs-promise');

const META_FILE_NAME = 'meta.json';
/**
 * A basic class representing ZenDesk entity: Category, Section or Article
 * Supports reading meta information and subfolders of entity's folder
 * Other ZenDesk entities inherit from this Class
 */
module.exports = class Document {
    /**
     * Crate a document.
     * Type of the document will be set as `generic_document`
     * @param {string} path - The path to document contents on filesystem
     *
     * @throws {Error} Will throw error if path is not string or empty
     */
    constructor(path) {
        if (typeof path !== 'string') {
            throw new Error('Document path must be a string');
        }

        if (!path.length) {
            throw new Error('Document path must not be empty');
        }

        this._path = path;

        this.type = 'generic_document';
        this.meta = {};
    }
    /**
     * Read the meta file.
     * Meta file name is being searched for is `meta.json`. After reading, meta contents
     * will be assigned to `this.meta`
     * If meta file is missing, returned promise will be rejected
     *
     * @returns {Promise} Promise to be fulfilled when metadata read completed
     */
    read() {
        return this._loadMeta()
            .then(meta => {
                this.meta = meta;
            });
    }

    _loadMeta() {
        return fsu.findFile(this._path, META_FILE_NAME)
            .then(metaPath => fs.readFile(metaPath, 'utf8'))
            .then(content => JSON.parse(content));
    }
};