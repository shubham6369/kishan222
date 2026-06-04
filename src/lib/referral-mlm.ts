import { db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc, setDoc, increment } from 'firebase/firestore';

export interface MlmLevelConfig {
  level: number;
  reward: number;
}

// Commission structure based on user guidelines
export const MLM_LEVELS: MlmLevelConfig[] = [
  { level: 1, reward: 7.00 },
  { level: 2, reward: 4.00 },
  { level: 3, reward: 2.50 },
  { level: 4, reward: 1.50 },
  { level: 5, reward: 1.00 },
  { level: 6, reward: 0.75 },
  { level: 7, reward: 0.50 },
  { level: 8, reward: 0.25 },
  { level: 9, reward: 0.25 },
  { level: 10, reward: 0.25 },
];

/**
 * Processes MLM referral payouts up to 10 levels.
 * 
 * @param registeredUserId - The UID of the newly registered and paid user
 * @param registeredUserFullName - The full name of the registered user
 * @param registeredUserPhone - The phone number of the registered user
 * @param referredByMembershipId - The membership ID of the direct referrer (Level 1)
 * @param paymentId - The transaction/payment ID confirming fee payment
 */
export async function processMlmReferral(
  registeredUserId: string,
  registeredUserFullName: string,
  registeredUserPhone: string,
  referredByMembershipId: string,
  paymentId: string
) {
  const normalizedPhone = (registeredUserPhone || '').replace(/\D/g, '');
  if (!referredByMembershipId) return;

  let currentReferredBy = referredByMembershipId;

  // Process up to 10 levels of MLM hierarchy
  for (const item of MLM_LEVELS) {
    if (!currentReferredBy) break;

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('membershipId', '==', currentReferredBy));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn(`[MLM Referral] Level ${item.level}: Referrer with membershipId ${currentReferredBy} not found.`);
        break;
      }

      const referrerDoc = querySnapshot.docs[0];
      const referrerId = referrerDoc.id;
      const referrerData = referrerDoc.data();

      // Prevent self-referral or circular reference back to the registered user
      if (referrerId === registeredUserId) {
        console.warn(`[MLM Referral] Level ${item.level}: Self-referral attempt blocked for ID ${referrerId}`);
        break;
      }

      // Check if phone number is identical (preventing gaming/fraud)
      const referrerPhone = (referrerData.phone || '').replace(/\D/g, '');
      if (referrerPhone && referrerPhone === normalizedPhone) {
        console.warn(`[MLM Referral] Level ${item.level}: Phone number self-referral blocked for ID ${referrerId}`);
        break;
      }

      const rewardAmount = item.reward;
      const stats = referrerData.stats || {};
      const levelCounts = stats.levelCounts || {};
      const levelEarnings = stats.levelEarnings || {};

      const newCount = (levelCounts[item.level.toString()] || 0) + 1;
      const newEarnings = (levelEarnings[item.level.toString()] || 0) + rewardAmount;

      const updateData: Record<string, unknown> = {
        walletBalance: increment(rewardAmount),
      };

      // Safely update or initialize nested stats object
      if (!referrerData.stats) {
        updateData.stats = {
          earnings: rewardAmount,
          totalReferrals: item.level === 1 ? 1 : 0,
          activeListings: 0,
          levelCounts: { [item.level.toString()]: newCount },
          levelEarnings: { [item.level.toString()]: newEarnings }
        };
      } else {
        updateData['stats.earnings'] = increment(rewardAmount);
        
        if (item.level === 1) {
          updateData['stats.totalReferrals'] = increment(1);
        }
        
        if (!stats.levelCounts) {
          updateData['stats.levelCounts'] = { [item.level.toString()]: newCount };
        } else {
          updateData[`stats.levelCounts.${item.level}`] = increment(1);
        }

        if (!stats.levelEarnings) {
          updateData['stats.levelEarnings'] = { [item.level.toString()]: newEarnings };
        } else {
          updateData[`stats.levelEarnings.${item.level}`] = increment(rewardAmount);
        }
      }

      // Write referrer updates
      await updateDoc(doc(db, 'users', referrerId), updateData);

      // Record referral details in the referrer's referrals subcollection
      const referralsRef = collection(db, 'users', referrerId, 'referrals');
      await setDoc(doc(referralsRef, registeredUserId), {
        referredUserId: registeredUserId,
        referredUserName: registeredUserFullName || 'Unknown Farmer',
        referredUserPhone: registeredUserPhone || '',
        joinedAt: new Date().toISOString(),
        reward: rewardAmount,
        level: item.level,
        paymentConfirmed: true,
        paymentId: paymentId,
      });

      console.log(`[MLM Referral] Successfully credited Level ${item.level} reward (₹${rewardAmount}) to referrer ${referrerId}`);

      // Traverse up to next level referrer in the chain
      currentReferredBy = referrerData.referredBy || null;

    } catch (err) {
      console.error(`[MLM Referral] Level ${item.level} processing failed:`, err);
      break; // Stop further levels to keep chain in consistent state
    }
  }
}
