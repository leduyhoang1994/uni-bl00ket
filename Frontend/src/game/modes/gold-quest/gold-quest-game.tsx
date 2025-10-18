import Quiz from "@/game/common/components/quiz/quiz";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import GoldQuestController, { chestImageMap, Chests, chestTextMap } from "./gold-quest.controller";
import QuizStore from "@/game/common/components/quiz/store";
import { useParams } from "react-router";
import HostController from "@/game/host/controller";
import { getGoldQuestControllerInstance } from "./gold-quest-controller.singleton";
import initSocketClient from "@/game/common/utils/socket-client.util";
import GoldQuestStore from "./store";
import HostStore from "@/game/host/store";
import "./styles/style.scss";
import RenderIf from "@/game/common/utils/condition-render";
import GoldQuestHeader from "./components/gold-quest-header";
import { gsap } from "gsap";
import GoldQuestInfoUser from "./components/gold-quest-info-user";
import { Player } from "@common/types/host.type";

const chestImgArr = [
  "/images/gold-quest/chest-one.svg",
  "/images/gold-quest/chest-two.svg",
  "/images/gold-quest/chest-three.svg",
];

export default function GoldQuest() {
  const [goldQuestController, setGoldQuestController] =
    useState<GoldQuestController | null>(null);
  const [chestsToChoose, setChestsToChoose] = useState<Array<Chests>>([]);
  const [selectedChest, setSelectedChest] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false); // Thêm state để chặn click khi đang animation
  const [completedAnim, setCompletedAnim] = useState(false);
  const [showPageTargetUser, setShowPageTargetUser] = useState(false);
  const [listOtherUser, setListOtherUser] = useState<Array<Player>>([]);
  const chestRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { setGold, gold } = GoldQuestStore();
  const { setToggleQuizContainer, setCurrentQuestion, reloadStore } =
    QuizStore();
  const { hostId } = useParams();
  const { userInfo } = HostStore();

  const loadNewQuestion = useCallback(async () => {
    const controller = getGoldQuestControllerInstance();
    const newQuestion = controller.getQuestion();
    setCurrentQuestion(newQuestion);
    setToggleQuizContainer(true);
  }, [setCurrentQuestion, setToggleQuizContainer]);

  const resetStatePerRound = () => {
    reloadStore();
    setChestsToChoose([]);
    setSelectedChest(null);
    setIsAnimating(false);
    setCompletedAnim(false);
    setShowPageTargetUser(false);
    loadNewQuestion();
  }

  // --- THAY ĐỔI 2: Cập nhật lại toàn bộ hàm openChest ---
  const openChest = useCallback(
    async (chestIndex: number) => {
      if (!hostId || !userInfo || isAnimating) return;
      setIsAnimating(true);
      setSelectedChest(chestIndex);
      const controller = getGoldQuestControllerInstance();
      const hostController = await HostController.getInstance();
      const chest = controller.getChestByIndex(chestIndex);

      if (!chest) {
        setIsAnimating(false);
        return;
      }

      // Logic game giữ nguyên
      const requireChoosePlayer = controller.requireChooseTarget(chest);
      if (requireChoosePlayer) {

        // TODO: Hiển thị màn chọn player, sau khi chọn player mới gọi hàm này
        let players = await hostController.getPlayers(hostId);
        players = players.filter((p) => p.id !== userInfo.id); // Loại player đang chơi ra khỏi danh sách chọn
        players = players.sort(() => Math.random() - 0.5);
        setListOtherUser(players);


      } else {
        controller.openChest(chest);
      }

      const tl = gsap.timeline({
        onComplete: () => {
          setCompletedAnim(true);
        },
      });

      const chosenContainer = chestRefs.current[chestIndex];
      if (!chosenContainer) return;

      const chosenButton = chosenContainer.querySelector("button");
      const chosenReward = chosenContainer.querySelector(".gold-quest__reward");

      // BƯỚC 1: Rương được chọn lắc tại chỗ
      tl.to(chosenButton, {
        rotation: 15,
        x: 10,
        duration: 0.1,
        yoyo: true,
        repeat: 5,
        ease: "power1.inOut",
      });

      // BƯỚC 2: Rương được chọn biến mất, phần thưởng của nó hiện ra
      tl.to(
        chosenButton,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.in",
          pointerEvents: "none",
        },
        ">"
      );

      tl.fromTo(
        chosenReward,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        "<"
      );

      // BƯỚC 3: SAU KHI phần thưởng chính đã hiện, hai rương còn lại mới biến mất
      chestRefs.current.forEach((container, i) => {
        if (i !== chestIndex && container) {
          const otherButton = container.querySelector("button");
          const otherReward = container.querySelector(".gold-quest__reward");
          const position = ">-0.2";

          tl.to(
            otherButton,
            {
              opacity: 0,
              scale: 0.8,
              duration: 0.4,
              ease: "power2.in",
              pointerEvents: "none",
            },
            position
          );

          tl.fromTo(
            otherReward,
            { opacity: 0, scale: 0.8 },
            // 👇 THAY ĐỔI Ở ĐÂY: Các phần thưởng còn lại có opacity là 0.6
            { opacity: 0.6, scale: 1, duration: 0.2, ease: "power2.out" },
            "<"
          );
        }
      });
    },
    [hostId, userInfo, isAnimating, reloadStore, loadNewQuestion]
  );

  const onQuizzDissmiss = useCallback(
    (correct: boolean) => {
      const controller = getGoldQuestControllerInstance();
      if (correct) {
        setChestsToChoose(controller.loadRandomChests());
      } else {
        reloadStore();
        setTimeout(() => {
          loadNewQuestion();
        }, 10);
      }
    },
    [loadNewQuestion, reloadStore]
  );

  const handleNextLayoutForUser = useCallback(() => {
    const idx = selectedChest ?? 0;
    const currentTypeChest = chestsToChoose[idx];
    if (!currentTypeChest) {
      resetStatePerRound();
      return;
    }
    if (
      currentTypeChest === Chests.Steal10 ||
      currentTypeChest === Chests.Steal25
    ) {
      setShowPageTargetUser(true);
      return;
    }
    resetStatePerRound();
  }, [selectedChest, chestsToChoose, resetStatePerRound, setShowPageTargetUser]);

  const handleActionOtherUser = useCallback((userTarget: Player) => {
    const controller = getGoldQuestControllerInstance();
    const chestIdx = selectedChest || 0;
    const chest = controller.getChestByIndex(chestIdx);
    controller.openChest(chest, userTarget);
    resetStatePerRound();
  }, [selectedChest, chestsToChoose, resetStatePerRound])

  useLayoutEffect(() => {
    (async () => {
      const token = await HostController.getAccessToken();
      const hostController = await HostController.getInstance();

      if (!hostId || !token) return;

      const controller = getGoldQuestControllerInstance(
        hostId,
        hostController.getQuestions()
      );

      setGoldQuestController(controller);

      controller.onGoldUpdate = (gold) => setGold(gold);
      controller.onGoldStealActive = (player, gold) => {
        alert(`Player ${player.username} has stolen ${gold} gold from you.`);
      };

      const socket = initSocketClient(hostId, token, controller);
      controller.setSocketClient(socket);
      await controller.initData();

      loadNewQuestion();
    })();
  }, []);

  // Hiệu ứng hover vẫn giữ nguyên, nhưng sẽ áp dụng khi `chestsToChoose` có phần tử
  useLayoutEffect(() => {
    if (chestsToChoose.length === 0) return;

    chestRefs.current.forEach((chestContainer) => {
      if (!chestContainer) return;

      const button = chestContainer.querySelector('button');
      if (!button) return;

      const enterAnimation = () => gsap.to(button, { scale: 1.1, duration: 0.2, ease: "power2.out" });
      const leaveAnimation = () => gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });

      button.addEventListener("mouseenter", enterAnimation);
      button.addEventListener("mouseleave", leaveAnimation);

      // Cleanup function
      return () => {
        button.removeEventListener("mouseenter", enterAnimation);
        button.removeEventListener("mouseleave", leaveAnimation);
      };
    });
  }, [chestsToChoose]);

  return (
    <>
      {goldQuestController && (
        <Quiz
          gameController={goldQuestController}
          onQuizDissmiss={onQuizzDissmiss}
        />
      )}
      <RenderIf condition={chestsToChoose.length > 0}>
        <main className="gold-quest">
          <GoldQuestHeader gold={gold} />
          <section className="gold-quest__content">
            <article className="gold-quest__content-title">
              <div>
                <RenderIf condition={!showPageTargetUser}>
                  <h1>{!isAnimating ? 'Choose a Chest!' : 'Click any where to go next'}</h1>
                </RenderIf>
                <RenderIf condition={showPageTargetUser}>
                  <h1>Choose a player to take from</h1>
                </RenderIf>
              </div>
            </article>
            <RenderIf condition={!showPageTargetUser}>
              <article className="gold-quest__content-chest">
                {chestsToChoose.map((chest, i) => (
                  <div
                    ref={(el) => { chestRefs.current[i] = el; }}
                    className="gold-quest__chest-container"
                    key={`${chest}-${i}`}
                  >
                    <button
                      className="gold-quest__button-chest"
                      onClick={() => openChest(i)}
                      disabled={isAnimating}
                    >
                      <img src={chestImgArr[i]} alt={`chest reward ${i}`} />
                    </button>
                    <div className={`gold-quest__reward`}>
                      <img src={chestImageMap[chest]} alt="Reward" />
                      <p>{chestTextMap[chest]}</p>
                    </div>
                  </div>
                ))}
              </article>
            </RenderIf>
            <RenderIf condition={showPageTargetUser}>
              <section className="gold-quest__content-section-other-user">
                {listOtherUser.map((user, i) => {
                  const userName = user.username;
                  const gold = user.score;
                  return (
                    <button style={{ display: 'flex' }} key={i} onClick={() => handleActionOtherUser(user)}>
                      <GoldQuestInfoUser userName={userName} gold={gold} />
                    </button>
                  )
                })}

              </section>
            </RenderIf>
          </section>
        </main>
        <RenderIf condition={completedAnim && !showPageTargetUser}>
          <div
            className="gold-quest__mask"
            onClick={handleNextLayoutForUser}
          ></div>
        </RenderIf>
      </RenderIf >
    </>
  );
}