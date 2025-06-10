import type { Player } from '../../types/player'

export const PlayerCard = ({ player }: { player: Player }) => {
  return (
    <div>
      <p>{player.name}</p>
      <p>{player.position}</p>
    </div>
  )
}