import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";
import type { Tour, TourStatus } from "../../types/models";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminTours">;

type TourFormState = {
  title: string;
  location: string;
  durationDays: string;
  price: string;
  tagline: string;
  imageUrl: string;
  description: string;
  highlights: string;
  itinerary: string;
  status: TourStatus;
};

const EMPTY_FORM: TourFormState = {
  title: "",
  location: "",
  durationDays: "",
  price: "",
  tagline: "",
  imageUrl: "",
  description: "",
  highlights: "",
  itinerary: "",
  status: "Draft",
};

function tourToFormState(tour: Tour): TourFormState {
  return {
    title: tour.title,
    location: tour.location,
    durationDays: tour.durationDays !== null && tour.durationDays !== undefined ? String(tour.durationDays) : "",
    price: tour.priceValue !== null && tour.priceValue !== undefined ? String(tour.priceValue) : "",
    tagline: tour.tagline || "",
    imageUrl: tour.imageUrl || "",
    description: tour.description || "",
    highlights: tour.highlights.join("\n"),
    itinerary: tour.itinerary.map((item) => item.description).join("\n"),
    status: tour.status || "Active",
  };
}

function normalizeText(value: string) {
  return value.trim();
}

function splitMultiline(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getStatusTone(status: TourStatus) {
  if (status === "Active") {
    return "success" as const;
  }

  if (status === "Draft") {
    return "warning" as const;
  }

  return "danger" as const;
}

export function TourManagementScreen({ navigation }: Props) {
  const {
    createTourByAdmin,
    deleteTourByAdmin,
    isTourSubmitting,
    isToursLoading,
    refreshTours,
    selectTour,
    tourError,
    tours,
    updateTourByAdmin,
  } = useAppContext();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TourStatus | "ALL">("ALL");
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [form, setForm] = useState<TourFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const visibleTours = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tours.filter((tour) => {
      const matchesFilter = filter === "ALL" || (tour.status || "Active") === filter;
      const matchesSearch =
        !keyword ||
        tour.title.toLowerCase().includes(keyword) ||
        tour.location.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search, tours]);

  const isEditing = Boolean(editingTourId);

  function resetForm() {
    setEditingTourId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  function startCreate() {
    setEditingTourId(null);
    setForm({
      ...EMPTY_FORM,
      status: filter === "ALL" ? "Draft" : filter,
    });
    setFormError(null);
  }

  function startEdit(tour: Tour) {
    setEditingTourId(tour.id);
    setForm(tourToFormState(tour));
    setFormError(null);
  }

  function updateField<K extends keyof TourFormState>(key: K, value: TourFormState[K]) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit() {
    const title = normalizeText(form.title);
    const location = normalizeText(form.location);
    const durationDays = Number(form.durationDays);
    const price = Number(String(form.price).replace(/[^\d.-]/g, ""));

    if (!title || !location) {
      setFormError("Ten tour va diem den khong duoc de trong.");
      return;
    }

    if (!Number.isInteger(durationDays) || durationDays <= 0) {
      setFormError("So ngay phai la so nguyen duong.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Gia tour phai la so hop le.");
      return;
    }

    setFormError(null);

    const payload = {
      title,
      location,
      durationDays,
      price,
      status: form.status,
      description: normalizeText(form.description),
      tagline: normalizeText(form.tagline),
      imageUrl: normalizeText(form.imageUrl),
      highlights: splitMultiline(form.highlights),
      itinerary: splitMultiline(form.itinerary),
    };

    if (editingTourId) {
      await updateTourByAdmin(editingTourId, payload);
    } else {
      await createTourByAdmin(payload);
    }

    resetForm();
  }

  async function handleDelete(tour: Tour) {
    await deleteTourByAdmin(tour.id);

    if (editingTourId === tour.id) {
      resetForm();
    }
  }

  return (
    <Screen>
      <AppHeader
        title="Quan ly tour"
        subtitle="Admin panel nay da ghi duoc vao backend de tao, sua va xoa tour thay vi chi doc danh sach."
        onBack={() => navigation.goBack()}
        rightLabel={editingTourId ? "Tao moi" : "Tai lai"}
        onRightPress={() => {
          if (editingTourId) {
            startCreate();
            return;
          }

          void refreshTours();
        }}
      />

      <View style={styles.editorCard}>
        <View style={styles.editorHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.editorTitle}>{isEditing ? "Sua tour" : "Tao tour moi"}</Text>
            <Text style={styles.editorText}>
              Form nay map vao `POST/PUT /api/tours` voi cac truong can thiet de backend validate thanh cong.
            </Text>
          </View>
          <StatusBadge label={isEditing ? "Edit mode" : "Create mode"} tone={isEditing ? "warning" : "success"} />
        </View>

        <View style={styles.formGrid}>
          <TextInput
            placeholder="Ten tour"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={form.title}
            onChangeText={(value) => updateField("title", value)}
          />
          <TextInput
            placeholder="Diem den"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={form.location}
            onChangeText={(value) => updateField("location", value)}
          />
          <TextInput
            placeholder="So ngay"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            keyboardType="number-pad"
            value={form.durationDays}
            onChangeText={(value) => updateField("durationDays", value)}
          />
          <TextInput
            placeholder="Gia tour"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            keyboardType="number-pad"
            value={form.price}
            onChangeText={(value) => updateField("price", value)}
          />
        </View>

        <TextInput
          placeholder="Tagline ngan"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={form.tagline}
          onChangeText={(value) => updateField("tagline", value)}
        />
        <TextInput
          placeholder="Image URL"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          value={form.imageUrl}
          onChangeText={(value) => updateField("imageUrl", value)}
        />
        <TextInput
          placeholder="Mo ta"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.multiline]}
          multiline
          value={form.description}
          onChangeText={(value) => updateField("description", value)}
        />
        <TextInput
          placeholder="Highlights, moi dong mot y"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.multiline]}
          multiline
          value={form.highlights}
          onChangeText={(value) => updateField("highlights", value)}
        />
        <TextInput
          placeholder="Itinerary, moi dong mot ngay"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, styles.multiline]}
          multiline
          value={form.itinerary}
          onChangeText={(value) => updateField("itinerary", value)}
        />

        <View style={styles.filterRow}>
          <ActionChip label="Active" active={form.status === "Active"} onPress={() => updateField("status", "Active")} />
          <ActionChip label="Draft" active={form.status === "Draft"} onPress={() => updateField("status", "Draft")} />
          <ActionChip label="Closed" active={form.status === "Closed"} onPress={() => updateField("status", "Closed")} />
        </View>

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
        {tourError ? <Text style={styles.errorText}>{tourError}</Text> : null}

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryAction} onPress={resetForm}>
            <Text style={styles.secondaryActionText}>Lam moi</Text>
          </Pressable>
          <Pressable disabled={isTourSubmitting} style={[styles.primaryAction, isTourSubmitting && styles.disabledAction]} onPress={() => void handleSubmit()}>
            <Text style={styles.primaryActionText}>
              {isTourSubmitting ? "Dang luu..." : isEditing ? "Cap nhat tour" : "Tao tour"}
            </Text>
          </Pressable>
        </View>
      </View>

      <TextInput
        placeholder="Tim theo ten tour, diem den..."
        placeholderTextColor={colors.textMuted}
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.filterRow}>
        <ActionChip label="Tat ca" active={filter === "ALL"} onPress={() => setFilter("ALL")} />
        <ActionChip label="Active" active={filter === "Active"} onPress={() => setFilter("Active")} />
        <ActionChip label="Draft" active={filter === "Draft"} onPress={() => setFilter("Draft")} />
        <ActionChip label="Closed" active={filter === "Closed"} onPress={() => setFilter("Closed")} />
      </View>

      {isToursLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai tours...</Text>
          <Text style={styles.loadingText}>He thong dang goi /api/tours.</Text>
        </View>
      ) : visibleTours.length === 0 ? (
        <EmptyState
          title="Khong co tour phu hop"
          description="Thu doi bo loc, tu khoa tim kiem hoac tao tour moi o panel ben tren."
        />
      ) : (
        <View style={styles.list}>
          {visibleTours.map((tour) => (
            <View key={tour.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.titleBlock}>
                  <Text style={styles.title}>{tour.title}</Text>
                  <Text style={styles.meta}>{tour.location} | {tour.duration}</Text>
                </View>
                <StatusBadge label={tour.status || "Active"} tone={getStatusTone(tour.status || "Active")} />
              </View>

              <View style={styles.metrics}>
                <Metric label="Gia" value={tour.price} />
                <Metric label="Danh gia" value={`* ${tour.rating}`} />
                <Metric label="Mode" value={editingTourId === tour.id ? "Editing" : "Live"} />
              </View>

              <Text style={styles.tagline}>{tour.tagline}</Text>

              <View style={styles.actionRow}>
                <Pressable style={styles.secondaryAction} onPress={() => startEdit(tour)}>
                  <Text style={styles.secondaryActionText}>Sua</Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryAction}
                  onPress={() => {
                    selectTour(tour);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.secondaryActionText}>Preview</Text>
                </Pressable>
                <Pressable
                  disabled={isTourSubmitting}
                  style={[styles.dangerAction, isTourSubmitting && styles.disabledAction]}
                  onPress={() => void handleDelete(tour)}
                >
                  <Text style={styles.dangerActionText}>Xoa</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  editorCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  editorTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  editorText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    flexGrow: 1,
    minWidth: "47%",
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  meta: {
    color: colors.textMuted,
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metric: {
    minWidth: 90,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  metricValue: {
    color: colors.text,
    fontWeight: "800",
  },
  tagline: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryAction: {
    flex: 1.2,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryActionText: {
    color: colors.surface,
    fontWeight: "900",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: "900",
  },
  dangerAction: {
    flex: 1,
    backgroundColor: "#FDE9E2",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  dangerActionText: {
    color: colors.danger,
    fontWeight: "900",
  },
  disabledAction: {
    opacity: 0.55,
  },
});
