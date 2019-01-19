# cre-dashboard

Requirements:

* npm & node
* tested with 
  * npm 6.4.1
  * node v11.1.0

## Project setup
```
npm install
```

## Environment variables
List of required environment variables:
```
VUE_APP_PDF_APP_URL           -> URL for embedding the PDF preview
VUE_APP_BASE_API_URL          -> backend URL 
VUE_APP_CLOUDINARY_UPLOAD_URL -> Cloudinary URL for image upload
VUE_APP_CLOUDINARY_PRESET     -> Cloudinary preset required for image upload
```

Environment variables are set in `.env` files. Only environment variables that are not sensitive, eg. URLs are committed into repository.
```
.env              -> basic config for local development
.env.test         -> config for testing environment
.env.production   -> config for production
```

Sensitive env variables are stored in corresponding `.env.local` files and are not tracked by git:
```
.env.production.local
.env.local
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production 
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Deployment

Firebase cli tool is required
```
npm install -g firebase-tools
```

```
firebase login // opens web browser

firebase deploy
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
