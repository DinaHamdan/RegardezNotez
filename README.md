# Regardez-Notez

## Getting started

### Docker compose

```sh
# Démarrer le projet "docker compose"
docker compose up -d

# Supprimer le projet "docker compose"
# Utile pour mettre à jour les variables d'environnement (.env)
docker compose down

# Arreter les containers du projet (le projet existe toujours)
docker compose down

# Démarre les containers du projet (le projet doit exister)
docker compose start

# Voir les logs d'un container
# Exemple nom container: nest-api, sveltekit
docker compose logs -f <nom-container>
```


## NestJS

[README.md](./nest-api/README.md)

> Dispo sur /api

[http://www.regardeznotez.localhost/api](http://www.regardeznotez.localhost/api)


## Sveltekit

[README.md](./sveltekit/README.md)

> Dispo sur /* (sauf /api)

[http://www.regardeznotez.localhost](http://www.regardeznotez.localhost)
