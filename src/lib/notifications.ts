/**
 * Notifications utility for sending SMS and WhatsApp messages.
 * This is a skeleton implementation. When ready to integrate a real provider 
 * (like Twilio, Gupshup, or MSG91), place the API calls here.
 */

export type NotificationType = 'SMS' | 'WHATSAPP';

export interface NotificationPayload {
    to: string; // The user's phone number
    message: string;
    type?: NotificationType;
}

/**
 * Sends a notification via the specified mechanism.
 * @param payload The notification payload including recipient, message and type
 * @returns Promise<boolean> indicating success
 */
export const sendNotification = async (payload: NotificationPayload): Promise<boolean> => {
    const { to, message, type = 'SMS' } = payload;
    
    // In a real implementation, you would:
    // 1. Format the phone number
    // 2. Build the provider-specific payload
    // 3. Make an HTTP request to the provider's API
    // 4. Handle success/error responses
    
    try {
        // SIMULATED API CALL
        console.log(`[NOTIFICATION SYSTEM] Routing ${type} to ${to}...`);
        console.log(`[NOTIFICATION SYSTEM] Message: "${message}"`);
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(`[NOTIFICATION SYSTEM] ✅ ${type} sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error(`[NOTIFICATION SYSTEM] ❌ Failed to send ${type} to ${to}:`, error);
        return false;
    }
};

// Ready-to-use notification templates
export const NotificationTemplates = {
    registrationSuccess: (name: string) => 
        `Welcome to Kishan Seva Samiti, ${name}! Your account has been created successfully.`,
        
    orderPlaced: (orderId: string, amount: number) => 
        `Your order #${orderId.slice(-8).toUpperCase()} for ₹${amount} has been placed successfully. Thank you for shopping with Kishan Seva Samiti!`,
        
    orderStatusUpdate: (orderId: string, status: string) => 
        `Update on your order #${orderId.slice(-8).toUpperCase()}: The status is now ${status.toUpperCase()}.`,
        
    paymentReceived: (amount: number) => 
        `We have received your payment of ₹${amount}. Thank you!`,
        
    referralBonus: (amount: number, referredUser: string) => 
        `Congratulations! You've earned a referral bonus of ₹${amount} because ${referredUser} joined using your code.`
};
