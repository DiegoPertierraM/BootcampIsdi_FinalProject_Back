/*
  Warnings:

  - You are about to drop the column `eventId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_EventAttendance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `meetId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "_EventAttendance" DROP CONSTRAINT "_EventAttendance_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventAttendance" DROP CONSTRAINT "_EventAttendance_B_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "eventId",
ADD COLUMN     "meetId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "_EventAttendance";

-- CreateTable
CREATE TABLE "Meet" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sport" "Sport" NOT NULL DEFAULT 'exercise',
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'default.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MeetAttendance" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SavedMeets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MeetAttendance_AB_unique" ON "_MeetAttendance"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetAttendance_B_index" ON "_MeetAttendance"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SavedMeets_AB_unique" ON "_SavedMeets"("A", "B");

-- CreateIndex
CREATE INDEX "_SavedMeets_B_index" ON "_SavedMeets"("B");

-- AddForeignKey
ALTER TABLE "Meet" ADD CONSTRAINT "Meet_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_meetId_fkey" FOREIGN KEY ("meetId") REFERENCES "Meet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetAttendance" ADD CONSTRAINT "_MeetAttendance_A_fkey" FOREIGN KEY ("A") REFERENCES "Meet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetAttendance" ADD CONSTRAINT "_MeetAttendance_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedMeets" ADD CONSTRAINT "_SavedMeets_A_fkey" FOREIGN KEY ("A") REFERENCES "Meet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SavedMeets" ADD CONSTRAINT "_SavedMeets_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
