#!/bin/bash

# SSH to NAT Instance Helper Script
# This script helps you SSH into the NAT instance for debugging

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}NAT Instance SSH Access Helper${NC}"
echo "=================================="

# Check if stack name is provided
if [ -z "$1" ]; then
    echo -e "${RED}Usage: $0 <stack-name> [key-name]${NC}"
    echo ""
    echo "Available SSH keys on this computer:"
    ls ~/.ssh/*.pub | sed 's/\.pub$//' | xargs -I {} basename {} | sed 's/^/  - /'
    echo ""
    echo "Example:"
    echo "  $0 agentic-foundation-staging aws-us-west-2"
    exit 1
fi

STACK_NAME="$1"
KEY_NAME="$2"

# If no key name provided, try to detect a common one
if [ -z "$KEY_NAME" ]; then
    if [ -f ~/.ssh/aws-us-west-2 ]; then
        KEY_NAME="aws-us-west-2"
        echo -e "${YELLOW}No key specified, using: $KEY_NAME${NC}"
    elif [ -f ~/.ssh/id_rsa ]; then
        KEY_NAME="id_rsa"
        echo -e "${YELLOW}No key specified, using: $KEY_NAME${NC}"
    else
        echo -e "${RED}No key name provided and no default key found.${NC}"
        echo "Available keys:"
        ls ~/.ssh/*.pub | sed 's/\.pub$//' | xargs -I {} basename {} | sed 's/^/  - /'
        exit 1
    fi
fi

# Check if the private key exists
if [ ! -f ~/.ssh/$KEY_NAME ]; then
    echo -e "${RED}Private key ~/.ssh/$KEY_NAME not found!${NC}"
    exit 1
fi

echo -e "${GREEN}Getting NAT instance public IP from CloudFormation stack...${NC}"

# Get the NAT instance public IP from CloudFormation
PUBLIC_IP=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='NatInstancePublicIp'].OutputValue" \
    --output text 2>/dev/null)

if [ -z "$PUBLIC_IP" ] || [ "$PUBLIC_IP" = "None" ]; then
    echo -e "${RED}Could not retrieve NAT instance public IP from stack: $STACK_NAME${NC}"
    echo "Make sure:"
    echo "1. The stack exists and is deployed"
    echo "2. You have AWS CLI configured with proper credentials"
    echo "3. The stack has completed deployment"
    exit 1
fi

echo -e "${GREEN}Found NAT instance at: $PUBLIC_IP${NC}"
echo -e "${GREEN}Using SSH key: ~/.ssh/$KEY_NAME${NC}"
echo ""

# SSH command
SSH_CMD="ssh -i ~/.ssh/$KEY_NAME ec2-user@$PUBLIC_IP"
echo -e "${YELLOW}Connecting with command: $SSH_CMD${NC}"
echo ""

# Connect
$SSH_CMD

echo ""
echo -e "${GREEN}SSH session ended.${NC}"
echo ""
echo "Debugging tips:"
echo "1. Check NAT configuration: sudo nft list ruleset"
echo "2. Check IP forwarding: cat /proc/sys/net/ipv4/ip_forward"
echo "3. Check routing: ip route show"
echo "4. Check network interfaces: ip addr show"
echo "5. Check NAT setup logs: sudo tail -f /var/log/nat-setup.log"
echo "6. Check system logs: sudo journalctl -u nat-instance.service"
echo "7. Test internet connectivity from NAT: ping 8.8.8.8"
