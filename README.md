ghost-openshift
===============

Getting Ghost "Kerouac" running on OpenShift

---

You'll have to manually copy the database to the `data`-directory outside of the `repo` on OpenShift to prevent the database from being overwritten upon deploy.

After first deploy:
1. SSH into your app `rhc ssh APPNAME`
2. copy db `cp app-root/repo/content/data/*.db app-root/data/`

---

To change environment, check `.openshift/action_hooks/pre_start`
