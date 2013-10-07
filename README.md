ghost-openshift
===============

Getting Ghost "Kerouac" running on OpenShift

---

The database gets created in the `data`-directory outside of the `repo` on OpenShift, to prevent it from being overwritten upon deploy.

---

We need to define a main script in `package.json` for OpenShift to know which script to run.

---

By default, this setup is running as `production`.
To change environment, check `.openshift/action_hooks/pre_start`
