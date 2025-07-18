import axios from "axios";
import { computed, ref } from "vue";
import dayjs from "dayjs";

type PubgRecordData = {
  participant: {
    stats: {
      combat: {
        kda: {
          kills: number;
        };
        damage: {
          damage_dealt: number;
        };
      };
    };
    user: {
      nickname: string;
    };
  };
  _id: string;
  offset: string;
  started_at: string;
};

/**5e37bd643116bb0001a9d97d */
export function usePubgRecord() {
  const isRequesting = ref(false);
  const records = ref<PubgRecordData[]>([]);

  const stat = computed(() => {
    let damage = 0;
    let kills = 0;
    if (isRequesting.value)
      return {
        damage,
        kills,
        isValid: false,
      };
    records.value.forEach((v) => {
      damage += v.participant.stats.combat.damage.damage_dealt;
      kills += v.participant.stats.combat.kda.kills;
    });
    return {
      damage,
      kills,
      name: records.value[0]?.participant.user.nickname || "",
      isValid: records.value.length > 0,
    };
  });

  async function fetchPubgRecord(userId: string, offset = "") {
    try {
      isRequesting.value = true;
      const params = {
        queue_size: 4,
        mode: "tpp",
        type: "official",
        offset,
      };
      const resp = await axios.get(`/api/pubg-record/${userId}`, {
        params,
      });
      const last = resp.data.matches.items[resp.data.matches.items.length - 1];
      if (records.value.some((v) => v._id === last._id)) {
        return;
      }
      const preDay = dayjs().subtract(1, "day").subtract(8, 'hour');
      records.value = records.value
        .concat(resp.data.matches.items)
        .filter((v) => dayjs(v.started_at).isAfter(preDay));
      if (last.offset && dayjs(last.started_at).isAfter(preDay)) {
        await fetchPubgRecord(userId, last.offset);
      }
    } catch (error) {
      console.error(error);
    } finally {
      isRequesting.value = false;
    }
  }

  return {
    isRequesting,
    records,
    stat,
    fetchPubgRecord,
  };
}
