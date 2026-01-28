# Cluster access

This project uses Amazon EKS.

## Configure kubectl access

```bash
aws eks update-kubeconfig \
  --region eu-north-1 \
  --name eks-portfolio-dev

```

## Verify Access

```
kubectl get nodes 
kubectl get ns 

```


